'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';
import ProductForm from '../../components/ProductForm';
import SignupPage from '../signup/page';


interface User {
  _id: string;
  name: string;
  email: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  image: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
    fetchProducts();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      router.push('/login');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
      }
    } catch  {
   
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter(product => product._id !== id));
      } else {
        console.error('Failed to delete product');
      }
    } catch {
      
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleProductCreated = () => {
    setShowProductForm(false);
    setEditingProduct(null);
    fetchProducts();
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span>Welcome, {user.name}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Products</h2>
          <button
            onClick={() => setShowProductForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Product
          </button>
        </div>

        {showProductForm && (
          <ProductForm
            product={editingProduct || undefined}
            onCancel={() => {
              setShowProductForm(false);
              setEditingProduct(null);
            }}
            onSuccess={handleProductCreated}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-2">{product.description}</p>
                <p className="text-gray-800 font-bold mb-2">${product.price.toFixed(2)}</p>
                <p className="text-gray-600 mb-2">Category: {product.category}</p>
                <p className="mb-4">
                  Status:{" "}
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs ${
                      product.inStock
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
         <SignupPage/>
        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found.</p>
          </div>
        )}
      </main>
    </div>
  );
}