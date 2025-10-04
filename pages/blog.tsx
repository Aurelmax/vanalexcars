import React from 'react';

export default function Blog() {
  // Exemple statique d'articles
  const articles = [
    { id: 1, title: 'Importer une Porsche en France', date: '2025-06-10' },
    { id: 2, title: 'Conseils pour l\'import automobile haut de gamme', date: '2025-07-15' },
  ];

  return (
    <main className="min-h-screen bg-premium-black text-premium-white px-6 py-16">
      <h1 className="text-3xl font-bold mb-6">Blog Vanalexcars</h1>
      <ul>
        {articles.map(({ id, title, date }) => (
          <li key={id} className="mb-4 border-b border-gray-700 pb-2">
            <h2 className="text-xl">{title}</h2>
            <time className="text-gray-400 text-sm">{date}</time>
          </li>
        ))}
      </ul>
    </main>
  );
}
