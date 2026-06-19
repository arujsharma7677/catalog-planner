'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import type { SignupData } from '@/services/authService';

export default function SignupPage() {
  const [formData, setFormData] = useState<SignupData>({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    seller_name: '',
    country: '',
    state: '',
    address: '',
    pincode: '',
    gst: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await signup(formData);
      router.push('/autofill');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-blue-50 p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-myntra-pink">Zynarix</h1>
            <p className="text-sm text-myntra-gray mt-1">AI-powered seller operations</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Details */}
            <div>
              <h3 className="text-sm font-semibold text-myntra-dark mb-4 uppercase tracking-wider">Account Details</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-myntra-dark mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-2 border border-myntra-border rounded-lg focus:ring-2 focus:ring-myntra-pink focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-myntra-dark mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-2 border border-myntra-border rounded-lg focus:ring-2 focus:ring-myntra-pink focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-myntra-dark mb-2">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-2 border border-myntra-border rounded-lg focus:ring-2 focus:ring-myntra-pink focus:border-transparent outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Personal Info */}
            <div>
              <h3 className="text-sm font-semibold text-myntra-dark mb-4 uppercase tracking-wider">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-myntra-dark mb-2">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-myntra-border rounded-lg focus:ring-2 focus:ring-myntra-pink focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-myntra-dark mb-2">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-myntra-border rounded-lg focus:ring-2 focus:ring-myntra-pink focus:border-transparent outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Seller Info */}
            <div>
              <h3 className="text-sm font-semibold text-myntra-dark mb-4 uppercase tracking-wider">Seller Information</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="sellerName" className="block text-sm font-medium text-myntra-dark mb-2">
                    Seller/Business Name
                  </label>
                  <input
                    id="sellerName"
                    type="text"
                    name="seller_name"
                    value={formData.seller_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-myntra-border rounded-lg focus:ring-2 focus:ring-myntra-pink focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label htmlFor="gst" className="block text-sm font-medium text-myntra-dark mb-2">
                    GST Number
                  </label>
                  <input
                    id="gst"
                    type="text"
                    name="gst"
                    value={formData.gst}
                    onChange={handleChange}
                    placeholder="18AABCG1234H1Z0"
                    required
                    className="w-full px-4 py-2 border border-myntra-border rounded-lg focus:ring-2 focus:ring-myntra-pink focus:border-transparent outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-myntra-dark mb-2">
                      Country
                    </label>
                    <input
                      id="country"
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-myntra-border rounded-lg focus:ring-2 focus:ring-myntra-pink focus:border-transparent outline-none transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-myntra-dark mb-2">
                      State
                    </label>
                    <input
                      id="state"
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-myntra-border rounded-lg focus:ring-2 focus:ring-myntra-pink focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-myntra-dark mb-2">
                    Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-myntra-border rounded-lg focus:ring-2 focus:ring-myntra-pink focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label htmlFor="pincode" className="block text-sm font-medium text-myntra-dark mb-2">
                    Pincode
                  </label>
                  <input
                    id="pincode"
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-myntra-border rounded-lg focus:ring-2 focus:ring-myntra-pink focus:border-transparent outline-none transition"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-myntra-pink text-white font-medium rounded-lg hover:bg-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-myntra-gray">
              Already have an account?{' '}
              <Link href="/login" className="text-myntra-pink font-medium hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
