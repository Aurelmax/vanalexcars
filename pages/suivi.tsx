import React from 'react';

export default function Suivi() {
  // Simulé, à connecter à API plus tard
  const demandes = [
    { id: 1, modele: 'Porsche 911', status: 'En cours' },
    { id: 2, modele: 'SUV Rouge', status: 'Livré' },
  ];

  return (
    <div className='px-6 py-16'>
      <h1 className='text-3xl font-bold mb-6'>Suivi de vos demandes</h1>
      <ul>
        {demandes.map(({ id, modele, status }) => (
          <li key={id} className='mb-4 p-4 border-b border-gray-700'>
            <p>
              <span className='font-semibold'>{modele}</span> : {status}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
