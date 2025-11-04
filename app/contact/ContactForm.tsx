"use client";

import { useState } from 'react';

export default function ContactForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!fullName || !email || !subject || !message) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, subject, message }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed to send message');
      setSuccess(true);
      setFullName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">Message sent successfully.</div>}

      <div>
        <label className="block text-sm font-medium text-slate-700">Full name</label>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="mt-1 block w-full rounded-md border px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Subject</label>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1 block w-full rounded-md border px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 block w-full rounded-md border px-3 py-2 h-32"
          required
        />
      </div>

      <div className="text-right">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-md bg-orange-600 px-4 py-2 text-white hover:bg-orange-700 disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </form>
  );
}
