import Image from 'next/image';
import Link from 'next/link';

interface Vehicle {
  id: number;
  title: string;
  price: string;
  year: number;
  mileage: string;
  location: string;
  imageUrl: string;
  isNew?: boolean;
  isFeatured?: boolean;
  fuelType: string;
  transmission: string;
  power: string;
}

interface VehicleGridProps {
  vehicles: Vehicle[];
  title?: string;
  showLoadMore?: boolean;
}

const mockVehicles: Vehicle[] = [
  {
    id: 1,
    title: 'Porsche 911 Carrera 4S',
    price: '€ 89 900',
    year: 2022,
    mileage: '12 500 km',
    location: 'Antibes',
    imageUrl: '/api/placeholder/300/200',
    isNew: false,
    isFeatured: true,
    fuelType: 'Essence',
    transmission: 'Automatique',
    power: '450 ch',
  },
  {
    id: 2,
    title: 'BMW M3 Competition',
    price: '€ 95 000',
    year: 2023,
    mileage: '8 200 km',
    location: 'Nice',
    imageUrl: '/api/placeholder/300/200',
    isNew: true,
    isFeatured: false,
    fuelType: 'Essence',
    transmission: 'Automatique',
    power: '510 ch',
  },
  {
    id: 3,
    title: 'Mercedes-AMG GT 63 S',
    price: '€ 125 000',
    year: 2021,
    mileage: '15 800 km',
    location: 'Cannes',
    imageUrl: '/api/placeholder/300/200',
    isNew: false,
    isFeatured: true,
    fuelType: 'Essence',
    transmission: 'Automatique',
    power: '630 ch',
  },
  {
    id: 4,
    title: 'Audi RS6 Avant',
    price: '€ 78 500',
    year: 2022,
    mileage: '18 500 km',
    location: 'Monaco',
    imageUrl: '/api/placeholder/300/200',
    isNew: false,
    isFeatured: false,
    fuelType: 'Essence',
    transmission: 'Automatique',
    power: '600 ch',
  },
  {
    id: 5,
    title: 'Porsche Taycan Turbo S',
    price: '€ 145 000',
    year: 2023,
    mileage: '5 200 km',
    location: 'Antibes',
    imageUrl: '/api/placeholder/300/200',
    isNew: true,
    isFeatured: true,
    fuelType: 'Électrique',
    transmission: 'Automatique',
    power: '761 ch',
  },
  {
    id: 6,
    title: 'Ferrari 488 GTB',
    price: '€ 195 000',
    year: 2020,
    mileage: '12 000 km',
    location: 'Nice',
    imageUrl: '/api/placeholder/300/200',
    isNew: false,
    isFeatured: true,
    fuelType: 'Essence',
    transmission: 'Automatique',
    power: '670 ch',
  },
];

export default function VehicleGrid({
  vehicles = mockVehicles,
  title = 'Nos meilleures offres',
  showLoadMore = true,
}: VehicleGridProps) {
  return (
    <section className='py-12 bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {title && (
          <div className='text-center mb-8'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>{title}</h2>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Découvrez les meilleures annonces de véhicules d'occasion premium
            </p>
          </div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {vehicles.map(vehicle => (
            <div
              key={vehicle.id}
              className='bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group'
            >
              {/* Image du véhicule */}
              <div className='relative h-48 bg-gray-200 overflow-hidden'>
                <Image
                  src={vehicle.imageUrl}
                  alt={vehicle.title}
                  className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                />
                {vehicle.isNew && (
                  <div className='absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold'>
                    Neuf
                  </div>
                )}
                {vehicle.isFeatured && (
                  <div className='absolute top-2 right-2 bg-premium-gold text-premium-black px-2 py-1 rounded text-xs font-semibold'>
                    Vedette
                  </div>
                )}

                {/* Actions */}
                <div className='absolute bottom-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  <button className='bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-md'>
                    <svg
                      className='w-4 h-4 text-gray-600'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                      />
                    </svg>
                  </button>
                  <button className='bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-md'>
                    <svg
                      className='w-4 h-4 text-gray-600'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                      />
                    </svg>
                  </button>
                  <button className='bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-md'>
                    <svg
                      className='w-4 h-4 text-gray-600'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01'
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Contenu de la carte */}
              <div className='p-4'>
                <h3 className='text-lg font-semibold text-gray-900 mb-2 line-clamp-2'>
                  {vehicle.title}
                </h3>

                <div className='text-2xl font-bold text-premium-gold mb-3'>
                  {vehicle.price}
                </div>

                <div className='space-y-1 text-sm text-gray-600 mb-4'>
                  <div className='flex justify-between'>
                    <span>{vehicle.year}</span>
                    <span>{vehicle.mileage}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>{vehicle.fuelType}</span>
                    <span>{vehicle.transmission}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>{vehicle.power}</span>
                    <span>{vehicle.location}</span>
                  </div>
                </div>

                <Link
                  href={`/vehicule/${vehicle.id}`}
                  className='block w-full bg-premium-gold text-premium-black text-center py-2 px-4 rounded font-semibold hover:bg-yellow-400 transition-colors duration-300'
                >
                  Voir les détails
                </Link>
              </div>
            </div>
          ))}
        </div>

        {showLoadMore && (
          <div className='text-center mt-8'>
            <button className='bg-white border border-premium-gold text-premium-gold px-6 py-3 rounded-lg font-semibold hover:bg-premium-gold hover:text-premium-black transition-colors duration-300'>
              Voir plus d'annonces
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
