import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='bg-premium-gray-dark border-t border-premium-gray'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Logo et description */}
          <div className='col-span-1 md:col-span-2'>
            <Link href='/' className='flex items-center mb-4'>
              <span className='text-2xl font-bold text-premium-gold'>
                Vanalexcars
              </span>
            </Link>
            <p className='text-premium-gray-light mb-4 max-w-md'>
              Votre expert en import automobile haut de gamme basé à Antibes.
              Spécialiste Porsche et véhicules de prestige.
            </p>
            <div className='text-premium-gray-light'>
              <p>📍 123 Rue Exemple, 06160 Antibes</p>
              <p>✉️ contact@vanalexcars.fr</p>
              <p>📞 +33 6 12 34 56 78</p>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className='text-premium-white font-semibold mb-4'>
              Navigation
            </h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/'
                  className='text-premium-gray-light hover:text-premium-gold transition'
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href='/offres'
                  className='text-premium-gray-light hover:text-premium-gold transition'
                >
                  Nos Offres
                </Link>
              </li>
              <li>
                <Link
                  href='/demande'
                  className='text-premium-gray-light hover:text-premium-gold transition'
                >
                  Demande
                </Link>
              </li>
              <li>
                <Link
                  href='/suivi'
                  className='text-premium-gray-light hover:text-premium-gold transition'
                >
                  Suivi
                </Link>
              </li>
            </ul>
          </div>

          {/* Informations */}
          <div>
            <h3 className='text-premium-white font-semibold mb-4'>
              Informations
            </h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/blog'
                  className='text-premium-gray-light hover:text-premium-gold transition'
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href='/contact'
                  className='text-premium-gray-light hover:text-premium-gold transition'
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href='/mentions-legales'
                  className='text-premium-gray-light hover:text-premium-gold transition'
                >
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className='border-t border-premium-gray mt-8 pt-8'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <p className='text-premium-gray-light text-sm'>
              © 2024 Vanalexcars. Tous droits réservés.
            </p>
            <p className='text-premium-gray-light text-sm mt-2 md:mt-0'>
              Import automobile haut de gamme à Antibes
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
