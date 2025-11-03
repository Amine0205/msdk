'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: ''
  });

  useEffect(() => {
    if (loggedIn) fetchProducts();
  }, [loggedIn]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .maybeSingle();

      if (error) throw error;
      if (!data || data.password !== password) {
        toast.error('Invalid credentials');
        return;
      }

      setLoggedIn(true);
      toast.success('Logged in');
    } catch (err) {
      console.error(err);
      toast.error('Login failed');
    }
  }

  async function fetchProducts() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setProducts((data || []) as Product[]);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setForm({ name: '', description: '', price: '', category: '', image_url: '' });
    setShowForm(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description || '',
      price: String(p.price),
      category: p.category,
      image_url: p.image_url || ''
    });
    setShowForm(true);
  }

  async function submitForm(e?: React.FormEvent) {
    e?.preventDefault();
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price) || 0,
      category: form.category,
      image_url: form.image_url || null
    };

    try {
      if (editing) {
        const { error } = await supabase.from('products').update(payload).eq('id', editing.id);
        if (error) throw error;
        toast.success('Product updated');
      } else {
        const { error } = await supabase.from('products').insert(payload);
        if (error) throw error;
        toast.success('Product created');
      }
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error('Save failed');
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm('Delete this product?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error('Delete failed');
    }
  }

  if (!loggedIn) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-xl">
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        <form onSubmit={login} className="space-y-4">
          <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit">Login</Button>
        </form>
        <p className="mt-3 text-sm text-slate-600">Default: admin / 12345</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Admin — Products</h2>
        <div className="space-x-2">
          <Button onClick={() => { setLoggedIn(false); setUsername(''); setPassword(''); }}>Logout</Button>
          <Button onClick={openCreate}>New Product</Button>
        </div>
      </div>

      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="text-left">
                <th>Name</th>
                <th>Category</th>
                <th>Price (MAD)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="py-3">{p.name}</td>
                  <td>{p.category}</td>
                  <td>{Number(p.price).toFixed(2)}</td>
                  <td className="space-x-2">
                    <Button onClick={() => openEdit(p)} size="sm">Edit</Button>
                    <Button onClick={() => deleteProduct(p.id)} variant="destructive" size="sm">Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-bold mb-4">{editing ? 'Edit Product' : 'Create Product'}</h3>
            <form onSubmit={submitForm} className="space-y-3">
              <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <label className="block">
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border rounded p-2 bg-white"
                >
                  <option value="">Select category</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Tech">Tech</option>
                  <option value="Home Decor">Home Decor</option>
                  <option value="Artisanal">Artisanal</option>
                </select>
              </label>
              <Input placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              <Input placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
              <textarea placeholder="Description" className="w-full border rounded p-2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit">{editing ? 'Update' : 'Create'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}