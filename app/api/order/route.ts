// filepath: d:\folders\amine 2\msdk\app\api\order\route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY: any = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const SMTP_HOST = process.env.SMTP_HOST ?? 'smtp.gmail.com';
const SMTP_PORT = process.env.SMTP_PORT ?? process.env.GMAIL_SMTP_PORT ?? '587';
const SMTP_USER = process.env.SMTP_USER ?? process.env.GMAIL_USER;
const SMTP_PASS = process.env.SMTP_PASS ?? process.env.GMAIL_PASS;
const SENDER_EMAIL = process.env.SENDER_EMAIL ?? SMTP_USER;
const SENDER_NAME = process.env.SENDER_NAME ?? 'MSDK';

const TEMPLATE_PATH = path.join(process.cwd(), 'app', 'api', 'order', 'email-template.html');
let cachedTemplate: string | null = null;

function escapeHtml(s: any) {
  if (s === null || s === undefined) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function loadTemplate(): Promise<string> {
  if (cachedTemplate) return cachedTemplate;
  const txt = await fs.promises.readFile(TEMPLATE_PATH, 'utf-8');
  cachedTemplate = txt;
  return txt;
}

function buildProductRows(order: any) {
  const products = order.products ?? [];
  return products
    .map((p: any) => {
      const imgCell = p.image_url
        ? `<td style="padding:8px"><img src="${escapeHtml(p.image_url)}" alt="${escapeHtml(p.name)}" style="width:80px;height:auto;border-radius:6px" /></td>`
        : `<td style="padding:8px">-</td>`;
      const nameCell = `<td style="padding:8px;vertical-align:middle">${escapeHtml(p.name || '')}</td>`;
      const qtyCell = `<td style="padding:8px;vertical-align:middle;text-align:center">${Number(p.quantity ?? 0)}</td>`;
      const unitCell = `<td style="padding:8px;vertical-align:middle;text-align:right">${Number(p.price ?? 0).toFixed(2)} MAD</td>`;
      const subtotal = ((Number(p.price ?? 0) || 0) * (Number(p.quantity ?? 0) || 0)).toFixed(2);
      const subtotalCell = `<td style="padding:8px;vertical-align:middle;text-align:right">${subtotal} MAD</td>`;
      return `<tr>${imgCell}${nameCell}${qtyCell}${unitCell}${subtotalCell}</tr>`;
    })
    .join('');
}

async function renderTemplate(order: any, senderName = 'MSDK') {
  const tpl = await loadTemplate();
  const productRows = buildProductRows(order);
  const total = Number(order.total ?? 0).toFixed(2);

  return tpl
    .replace(/{{ORDER_FULL_NAME}}/g, escapeHtml(order.full_name ?? ''))
    .replace(/{{ORDER_PHONE}}/g, escapeHtml(order.phone ?? ''))
    .replace(/{{ORDER_EMAIL}}/g, escapeHtml(order.email ?? ''))
    .replace(/{{ORDER_ADDRESS}}/g, escapeHtml(order.address ?? ''))
    .replace(/{{ORDER_CITY}}/g, escapeHtml(order.city ?? ''))
    .replace(/{{ORDER_TOTAL}}/g, `${total}`)
    .replace(/{{SENDER_NAME}}/g, escapeHtml(senderName))
    .replace(/{{PRODUCT_ROWS}}/g, productRows);
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
        await transporter.verify();
        const html = await renderTemplate(orderRow, SENDER_NAME);
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

    return NextResponse.json({ success: true, order: data, emailStatus });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message ?? 'Unknown error' }, { status: 500 });
  }
}