import React, { useState } from 'react';

export default function FormulaireDemande() {
  const [formData, setFormData] = useState({ name: '', email: '', voiture: '' });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Demande envoyée, merci !');
    // A remplacer par appel API réel
  };

  return (
    <div className="px-6 py-16">
      <h1 className="text-3xl font-bold mb-6">Formulaire de demande</h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Nom complet"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-3 rounded bg-gray-800 text-white"
        />
        <input
          type="email"
          name="email"
          placeholder="Adresse e-mail"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 rounded bg-gray-800 text-white"
        />
        <input
          type="text"
          name="voiture"
          placeholder="Modèle recherché"
          value={formData.voiture}
          onChange={handleChange}
          required
          className="w-full p-3 rounded bg-gray-800 text-white"
        />
        <button type="submit" className="bg-premium-gold px-6 py-3 rounded font-semibold text-premium-black hover:bg-yellow-400 transition">
          Soumettre la demande
        </button>
      </form>
    </div>
  );
}
