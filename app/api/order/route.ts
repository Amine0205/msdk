import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY:any = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const SMTP_HOST = process.env.SMTP_HOST ?? 'smtp.gmail.com';
const SMTP_PORT = process.env.SMTP_PORT ?? process.env.GMAIL_SMTP_PORT ?? '587';
const SMTP_USER = process.env.SMTP_USER ?? process.env.GMAIL_USER;
const SMTP_PASS = process.env.SMTP_PASS ?? process.env.GMAIL_PASS;
const SENDER_EMAIL = process.env.SENDER_EMAIL ?? SMTP_USER;
const SENDER_NAME = process.env.SENDER_NAME ?? 'MSDK';

function buildOrderHtml(order: any) {
  const products = order.products ?? [];
  const rows = products
    .map((p: any) => {
      const img = p.image_url
        ? `<td style="padding:8px"><img src="${p.image_url}" alt="${escapeHtml(p.name)}" style="width:80px;height:auto;border-radius:6px" /></td>`
        : `<td style="padding:8px">-</td>`;
      const name = `<td style="padding:8px;vertical-align:middle">${escapeHtml(p.name || '')}</td>`;
      const qty = `<td style="padding:8px;vertical-align:middle;text-align:center">${Number(p.quantity ?? 0)}</td>`;
      const unit = `<td style="padding:8px;vertical-align:middle;text-align:right">${Number(p.price ?? 0).toFixed(2)} MAD</td>`;
      const subtotal = `<td style="padding:8px;vertical-align:middle;text-align:right">${((Number(p.price ?? 0) || 0) * (Number(p.quantity ?? 0) || 0)).toFixed(2)} MAD</td>`;
      return `<tr>${img}${name}${qty}${unit}${subtotal}</tr>`;
    })
    .join('');

  const total = Number(order.total ?? 0).toFixed(2);

  return `
    <div style="font-family:system-ui, -apple-system, Roboto, 'Helvetica Neue', Arial; color:#111">
      <h2>Merci pour votre commande, ${escapeHtml(order.full_name || 'Client')}</h2>
      <p>Nous avons bien reçu votre commande. Détails ci‑dessous :</p>

      <h3>Produits</h3>
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="background:#f7f7f7">
            <th style="padding:8px;text-align:left">Image</th>
            <th style="padding:8px;text-align:left">Produit</th>
            <th style="padding:8px;width:80px">Qté</th>
            <th style="padding:8px;width:120px;text-align:right">Prix Unitaire</th>
            <th style="padding:8px;width:120px;text-align:right">Sous-total</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>

      <div style="margin-top:12px;padding:12px;border-top:1px solid #eee;text-align:right">
        <strong>Total: ${total} MAD</strong>
      </div>

      <p style="color:#666;margin-top:10px">Paiement: Paiement à la livraison.</p>

      <p style="margin-top:20px">Cordialement,<br/>L'équipe ${escapeHtml(SENDER_NAME)}</p>
    </div>
  `;
}

function escapeHtml(s: any) {
  if (s === null || s === undefined) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { full_name, phone, email, address, city, notes, products, total } = body ?? {};

    // minimal validation
    if (!full_name || !phone || !address || !city || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createClient(SUPABASE_URL!, SERVICE_KEY || ANON_KEY);

    const orderRow = { full_name, phone, email: email ?? null, address, city, notes: notes ?? null, products, total: Number(total ?? 0) };

    const { data, error } = await supabase.from('orders').insert(orderRow).select('*').maybeSingle();
    if (error) return NextResponse.json({ success: false, error: error.message ?? 'Failed to create order' }, { status: 500 });

    if (SMTP_USER && SMTP_PASS) {
    } else {
    }

    // default emailStatus when no SMTP config or no recipient
    let emailStatus = { sent: false, info: null as any, error: null as any };

    if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && email) {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });

      try {
        // verify connection
        await transporter.verify();

        const html = buildOrderHtml(orderRow);
        const text = `Merci ${full_name}, votre commande a été reçue. Total: ${Number(total ?? 0).toFixed(2)} MAD`;

        const info = await transporter.sendMail({
          from: `"${SENDER_NAME}" <${SENDER_EMAIL}>`,
          to: email,
          subject: 'Confirmation de commande — MSDK',
          text,
          html,
        });

        emailStatus = { sent: true, info: { accepted: info.accepted, rejected: info.rejected, response: info.response }, error: null };

        if (typeof transporter.close === 'function') transporter.close();
      } catch (sendErr: any) {
        emailStatus = { sent: false, info: null, error: String(sendErr?.message ?? sendErr) };
      }
    }

    // return order + emailStatus so client can wait/inspect before redirect
    return NextResponse.json({ success: true, order: data, emailStatus });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message ?? 'Unknown error' }, { status: 500 });
  }
}