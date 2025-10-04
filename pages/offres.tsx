import React from 'react';

export default function Offres() {
  // Exemple statique, remplacer par données API
  const offres = [
    { id: 1, modele: 'Porsche 911 Cabriolet', prix: '81 450 €' },
    { id: 2, modele: 'SUV Diesel Rouge', prix: '55 900 €' },
  ];

  return (
    <div className="px-6 py-16">
      <h1 className="text-3xl font-bold mb-6">Nos Offres</h1>
      <ul>
        {offres.map(({ id, modele, prix }) => (
          <li key={id} className="mb-4 p-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold">{modele}</h2>
            <p className="text-gray-400">{prix}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
