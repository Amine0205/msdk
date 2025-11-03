import { Store, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-slate-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Store className="h-6 w-6 text-orange-600" />
              <span className="text-xl font-bold text-slate-900">MSDK</span>
            </div>
            <p className="text-sm text-slate-600">
              Your destination for authentic Moroccan products, modern tech, and artisanal treasures.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="/" className="hover:text-orange-600 transition-colors">Home</a></li>
              <li><a href="/products" className="hover:text-orange-600 transition-colors">Products</a></li>
              <li><a href="/cart" className="hover:text-orange-600 transition-colors">Cart</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>contact@msdk.ma</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Morocco</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-slate-600">
          <p>&copy; {new Date().getFullYear()} MSDK. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}