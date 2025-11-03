import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // set in .env.local (server-only)

const supabaseAdmin = createClient(url, serviceKey);

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { full_name, phone, email, address, city, notes, products, total } = data;

    if (!full_name || !phone || !address || !city || !products || !total) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data: orderData, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([
        {
          full_name,
          phone,
          email: email || null,
          address,
          city,
          notes: notes || null,
          products,
          total,
        },
      ])
      .select()
      .single();

    if (orderError) {
      console.error('Database error:', orderError);
      return NextResponse.json(
        { success: false, error: 'Failed to save order' },
        { status: 500 }
      );
    }

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.ADMIN_EMAIL,
          pass: process.env.ADMIN_EMAIL_PASSWORD,
        },
      });

      const productsHtml = products
        .map(
          (p: any) =>
            `<tr>
              <td style="padding: 8px; border: 1px solid #ddd;">${p.name}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${p.quantity}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${p.price.toFixed(2)} MAD</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${(p.price * p.quantity).toFixed(2)} MAD</td>
            </tr>`
        )
        .join('');

      await transporter.sendMail({
        from: process.env.ADMIN_EMAIL,
        to: process.env.ADMIN_EMAIL,
        subject: `New Order from ${full_name} - MSDK E-commerce`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #ea580c; border-bottom: 2px solid #ea580c; padding-bottom: 10px;">
              New Order Received
            </h2>

            <h3 style="color: #334155; margin-top: 20px;">Customer Information</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px; background-color: #f1f5f9;"><strong>Name:</strong></td>
                <td style="padding: 8px;">${full_name}</td>
              </tr>
              <tr>
                <td style="padding: 8px; background-color: #f1f5f9;"><strong>Phone:</strong></td>
                <td style="padding: 8px;">${phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px; background-color: #f1f5f9;"><strong>Email:</strong></td>
                <td style="padding: 8px;">${email || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px; background-color: #f1f5f9;"><strong>Address:</strong></td>
                <td style="padding: 8px;">${address}</td>
              </tr>
              <tr>
                <td style="padding: 8px; background-color: #f1f5f9;"><strong>City:</strong></td>
                <td style="padding: 8px;">${city}</td>
              </tr>
              ${notes ? `<tr>
                <td style="padding: 8px; background-color: #f1f5f9;"><strong>Notes:</strong></td>
                <td style="padding: 8px;">${notes}</td>
              </tr>` : ''}
            </table>

            <h3 style="color: #334155; margin-top: 20px;">Order Details</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr style="background-color: #ea580c; color: white;">
                  <th style="padding: 10px; text-align: left;">Product</th>
                  <th style="padding: 10px; text-align: center;">Quantity</th>
                  <th style="padding: 10px; text-align: right;">Price</th>
                  <th style="padding: 10px; text-align: right;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${productsHtml}
              </tbody>
              <tfoot>
                <tr style="background-color: #f1f5f9; font-weight: bold;">
                  <td colspan="3" style="padding: 10px; text-align: right;">Total:</td>
                  <td style="padding: 10px; text-align: right; color: #ea580c;">${total.toFixed(2)} MAD</td>
                </tr>
              </tfoot>
            </table>

            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-top: 20px;">
              <strong>Payment Method:</strong> Cash on Delivery
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px;">
              <p>Order ID: ${orderData.id}</p>
              <p>Date: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Email error:', emailError);
    }

    return NextResponse.json({ success: true, orderId: orderData.id });
  } catch (error) {
    console.error('Order processing error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process order' },
      { status: 500 }
    );
  }
}