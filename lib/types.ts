export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  created_at: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderData {
  full_name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  notes?: string;
  products: CartItem[];
  total: number;
}