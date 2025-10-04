import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-premium-black text-premium-white px-6 py-16">
      <h1 className="text-4xl font-bold mb-4">Bienvenue chez Vanalexcars</h1>
      <p className="max-w-xl text-gray-300 mb-8">
        Votre expert en import automobile haut de gamme basé à Antibes. Spécialiste Porsche et véhicules de prestige.
      </p>
      <Link href="/demande" className="inline-block bg-premium-gold text-premium-black px-6 py-3 font-semibold rounded hover:bg-yellow-400 transition">
        Demandez votre véhicule
      </Link>
    </main>
  );
}
