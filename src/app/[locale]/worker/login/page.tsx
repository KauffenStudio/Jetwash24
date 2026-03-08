'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';

export default function WorkerLoginPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.ok) {
      router.push(`/${locale}/worker`);
      router.refresh();
    } else {
      setError('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="text-2xl font-black tracking-widest text-white">
            JETWASH<span className="text-gold">24</span>
          </p>
          <p className="text-white/40 text-sm mt-2">Trabalhador</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-2xl">
          <h1 className="text-xl font-bold text-black mb-6">Acesso Trabalhador</h1>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-surface-200 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
                placeholder="worker@jetwash24.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-surface-200 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 bg-black text-white font-bold rounded-lg hover:bg-surface-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                A entrar...
              </>
            ) : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
