import React, { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className='bg-premium-black border-b border-premium-gray-dark'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center py-4'>
          {/* Logo */}
          <Link href='/' className='flex items-center'>
            <span className='text-2xl font-bold text-premium-gold'>
              Vanalexcars
            </span>
          </Link>

          {/* Navigation Desktop */}
          <nav className='hidden md:flex space-x-8'>
            <Link
              href='/'
              className='text-premium-white hover:text-premium-gold transition'
            >
              Accueil
            </Link>
            <Link
              href='/offres'
              className='text-premium-white hover:text-premium-gold transition'
            >
              Nos Offres
            </Link>
            <Link
              href='/demande'
              className='text-premium-white hover:text-premium-gold transition'
            >
              Demande
            </Link>
            <Link
              href='/suivi'
              className='text-premium-white hover:text-premium-gold transition'
            >
              Suivi
            </Link>
            <Link
              href='/blog'
              className='text-premium-white hover:text-premium-gold transition'
            >
              Blog
            </Link>
            <Link
              href='/contact'
              className='text-premium-white hover:text-premium-gold transition'
            >
              Contact
            </Link>
          </nav>

          {/* Bouton CTA */}
          <div className='hidden md:block'>
            <Link
              href='/demande'
              className='bg-premium-gold text-premium-black px-4 py-2 rounded font-semibold hover:bg-yellow-400 transition'
            >
              Demander un véhicule
            </Link>
          </div>

          {/* Menu Mobile Button */}
          <button
            onClick={toggleMenu}
            className='md:hidden text-premium-white hover:text-premium-gold'
            aria-label='Toggle menu'
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 6h16M4 12h16M4 18h16'
              />
            </svg>
          </button>
        </div>

        {/* Navigation Mobile */}
        {isMenuOpen && (
          <div className='md:hidden'>
            <div className='px-2 pt-2 pb-3 space-y-1 bg-premium-gray-dark rounded-lg mt-2'>
              <Link
                href='/'
                className='block px-3 py-2 text-premium-white hover:text-premium-gold'
              >
                Accueil
              </Link>
              <Link
                href='/offres'
                className='block px-3 py-2 text-premium-white hover:text-premium-gold'
              >
                Nos Offres
              </Link>
              <Link
                href='/demande'
                className='block px-3 py-2 text-premium-white hover:text-premium-gold'
              >
                Demande
              </Link>
              <Link
                href='/suivi'
                className='block px-3 py-2 text-premium-white hover:text-premium-gold'
              >
                Suivi
              </Link>
              <Link
                href='/blog'
                className='block px-3 py-2 text-premium-white hover:text-premium-gold'
              >
                Blog
              </Link>
              <Link
                href='/contact'
                className='block px-3 py-2 text-premium-white hover:text-premium-gold'
              >
                Contact
              </Link>
              <div className='pt-2'>
                <Link
                  href='/demande'
                  className='block bg-premium-gold text-premium-black px-3 py-2 rounded font-semibold text-center hover:bg-yellow-400 transition'
                >
                  Demander un véhicule
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
