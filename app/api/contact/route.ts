import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, subject, message } = body;

    if (!fullName || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_PASS;
    const receiver = process.env.GMAIL_RECEIVER;

    if (!user || !pass) {
      console.error('Missing email credentials');
      return NextResponse.json({ error: 'Email not configured on server' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });

    const mailOptions = {
      from: `${fullName} <${email}>`,
      to: receiver,
      subject: `[Contact] ${subject}`,
      html: `<p><strong>From:</strong> ${fullName} &lt;${email}&gt;</p>
             <p><strong>Message:</strong></p>
             <div>${message.replace(/\n/g, '<br/>')}</div>`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to send email' }, { status: 500 });
  }
}
