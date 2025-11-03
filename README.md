# MSDK E-commerce Store

A modern, production-ready e-commerce website for MSDK, offering Moroccan fashion accessories, tech gadgets, home decor, and artisanal products with Cash on Delivery payment.

## Features

- **Product Catalog**: Browse products by category (Fashion, Tech, Home Decor, Artisanal)
- **Shopping Cart**: Add items, adjust quantities, and review before checkout
- **Cash on Delivery**: No online payment required - pay when you receive your order
- **Order Management**: Orders stored in Supabase database
- **Email Notifications**: Admin receives email alerts for new orders
- **Responsive Design**: Beautiful mobile-first design with Moroccan-inspired colors
- **Product Details**: Individual pages for each product with full descriptions

## Tech Stack

- **Frontend**: Next.js 13 (App Router), TypeScript, TailwindCSS
- **UI Components**: shadcn/ui, Lucide React icons
- **Database**: Supabase (PostgreSQL)
- **Email**: Nodemailer (Gmail SMTP)
- **Deployment**: Vercel

## Getting Started

### 1. Clone and Install

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. The database tables are already created via migration
3. Copy your project URL and anon key from Settings > API

### 3. Configure Environment Variables

Update `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
ADMIN_EMAIL=contact@msdk.ma
ADMIN_EMAIL_PASSWORD=your_gmail_app_password
```

**For Gmail:**
1. Go to your Google Account settings
2. Enable 2-factor authentication
3. Generate an "App Password" for mail
4. Use that app password in `ADMIN_EMAIL_PASSWORD`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

### 5. Build for Production

```bash
npm run build
npm start
```

## Database Structure

### Products Table
- `id`: UUID (Primary Key)
- `name`: Product name
- `description`: Product description
- `price`: Price in MAD
- `category`: Fashion, Tech, Home Decor, or Artisanal
- `image_url`: Product image URL
- `created_at`: Timestamp

### Orders Table
- `id`: UUID (Primary Key)
- `full_name`: Customer name
- `phone`: Phone number
- `email`: Email (optional)
- `address`: Delivery address
- `city`: City
- `notes`: Order notes (optional)
- `total`: Order total amount
- `products`: JSONB array of cart items
- `created_at`: Timestamp

Sample products are automatically inserted during migration.

## Deployment to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel project settings
4. Deploy!

Vercel will automatically:
- Build your Next.js app
- Set up serverless functions for API routes
- Provide a production URL

## How It Works

1. **Browse**: Users browse products on the homepage or products page
2. **Add to Cart**: Products are added to a client-side cart (localStorage)
3. **Checkout**: Users fill in delivery information
4. **Order Submission**:
   - Order is saved to Supabase database
   - Admin receives email notification with order details
   - User sees success confirmation
5. **Fulfillment**: Admin processes order and arranges delivery (COD)

## Customization

### Add Products

You can add products via Supabase dashboard or SQL:

```sql
INSERT INTO products (name, description, price, category, image_url)
VALUES (
  'Product Name',
  'Product description',
  199.99,
  'Fashion',
  'https://example.com/image.jpg'
);
```

### Update Branding

- Colors: Update Tailwind classes in components (currently terracotta/orange theme)
- Logo: Modify the Store icon in `components/header.tsx`
- Content: Edit text in `app/page.tsx` for homepage

### Email Template

Modify the HTML template in `app/api/order/route.ts` to customize order emails.

## Project Structure

```
├── app/
│   ├── api/order/          # Order submission API route
│   ├── cart/               # Shopping cart page
│   ├── checkout/           # Checkout form
│   ├── product/[id]/       # Product detail pages
│   ├── products/           # Product listing page
│   ├── layout.tsx          # Root layout with header/footer
│   └── page.tsx            # Homepage
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── header.tsx          # Navigation header
│   ├── footer.tsx          # Footer
│   └── product-card.tsx    # Product card component
├── hooks/
│   └── use-cart.ts         # Cart management hook
├── lib/
│   ├── cart-store.ts       # Cart state management
│   ├── supabase.ts         # Supabase client
│   ├── types.ts            # TypeScript types
│   └── utils.ts            # Utility functions
└── .env.local              # Environment variables
```

## Support

For issues or questions, contact: contact@msdk.ma

## License

Private - MSDK E-commerce Store