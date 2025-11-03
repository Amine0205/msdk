/*
  # Create E-commerce Tables for MSDK

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text, not null) - Product name
      - `description` (text) - Product description
      - `price` (numeric) - Product price in MAD
      - `category` (text, not null) - Product category (Fashion, Tech, Home Decor, Artisanal)
      - `image_url` (text) - Product image URL
      - `created_at` (timestamp) - Record creation timestamp
    
    - `orders`
      - `id` (uuid, primary key)
      - `full_name` (text, not null) - Customer full name
      - `phone` (text, not null) - Customer phone number
      - `email` (text) - Customer email (optional)
      - `address` (text, not null) - Delivery address
      - `city` (text, not null) - Delivery city
      - `notes` (text) - Order notes (optional)
      - `total` (numeric) - Order total amount
      - `products` (jsonb, not null) - Cart products as JSON
      - `created_at` (timestamp) - Order creation timestamp
  
  2. Security
    - Enable RLS on both tables
    - Add policies for public read access on products
    - Add policies for authenticated insert on orders (public insert for this use case)
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  category text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text NOT NULL,
  email text,
  address text NOT NULL,
  city text NOT NULL,
  notes text,
  total numeric(10,2),
  products jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Products policies: Allow public read access
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);

-- Orders policies: Allow anyone to insert orders (for COD public checkout)
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Insert sample products for MSDK
INSERT INTO products (name, description, price, category, image_url) VALUES
  ('Moroccan Leather Handbag', 'Handcrafted leather handbag with traditional Moroccan patterns', 450.00, 'Fashion', 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Kaftan Embroidered Dress', 'Elegant kaftan with intricate embroidery, perfect for special occasions', 890.00, 'Fashion', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Wireless Earbuds Pro', 'Premium wireless earbuds with noise cancellation and 24h battery', 320.00, 'Tech', 'https://images.pexels.com/photos/3825517/pexels-photo-3825517.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Smart Watch Elite', 'Fitness tracking smart watch with heart rate monitor and GPS', 580.00, 'Tech', 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Berber Wool Rug', 'Authentic handwoven Berber rug with geometric patterns', 1200.00, 'Home Decor', 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Moroccan Tea Set', 'Traditional silver-plated tea set with decorated glasses', 380.00, 'Home Decor', 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Argan Oil Gift Set', 'Pure Moroccan argan oil collection for hair and skin care', 250.00, 'Artisanal', 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Handmade Ceramic Tagine', 'Traditional hand-painted ceramic tagine for authentic Moroccan cooking', 340.00, 'Artisanal', 'https://images.pexels.com/photos/6419718/pexels-photo-6419718.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Babouche Slippers', 'Comfortable traditional Moroccan leather slippers in vibrant colors', 180.00, 'Fashion', 'https://images.pexels.com/photos/1274941/pexels-photo-1274941.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Portable Bluetooth Speaker', 'Waterproof wireless speaker with premium sound quality', 290.00, 'Tech', 'https://images.pexels.com/photos/1279406/pexels-photo-1279406.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Moroccan Lantern Set', 'Decorative metal lanterns with intricate cutout designs', 420.00, 'Home Decor', 'https://images.pexels.com/photos/2955375/pexels-photo-2955375.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Natural Olive Oil Soap', 'Handmade traditional Moroccan black soap with eucalyptus', 95.00, 'Artisanal', 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=800')
ON CONFLICT DO NOTHING;