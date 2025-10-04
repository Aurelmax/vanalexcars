'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface Vehicle {
  id?: number;
  title: string;
  content: string;
  price: number;
  year: number;
  mileage: number;
  location: string;
  fuel_type: string;
  transmission: string;
  power: string;
  description: string;
  is_featured: boolean;
  is_new: boolean;
  is_sold: boolean;
  image_url?: string;
  featured_image?: {
    id: number;
    url: string;
    alt: string;
  };
  gallery?: Array<{
    id: number;
    url: string;
    alt: string;
    order: number;
  }>;
}

interface VehicleManagerProps {
  vehicles: Vehicle[];
  onSave: (vehicle: Vehicle) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onImageUpload: (file: File) => Promise<{ id: number; url: string }>;
  onImageDelete?: (imageId: number) => Promise<void>;
}

export default function VehicleManager({
  vehicles,
  onSave,
  onDelete,
  onImageUpload,
  onImageDelete,
}: VehicleManagerProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [dragActive, setDragActive] = useState(false);
  const [draggedImage, setDraggedImage] = useState<number | null>(null);

  // Ajouter une image à la galerie
  const addImageToGallery = useCallback(
    async (file: File) => {
      if (!selectedVehicle) return;

      try {
        const uploadedImage = await onImageUpload(file);
        const newImage = {
          id: uploadedImage.id,
          url: uploadedImage.url,
          alt: selectedVehicle.title,
          order: (selectedVehicle.gallery?.length || 0) + 1,
        };

        const updatedGallery = [...(selectedVehicle.gallery || []), newImage];
        setSelectedVehicle({
          ...selectedVehicle,
          gallery: updatedGallery,
        });
      } catch (error) {
        console.error("Erreur lors de l'ajout de l'image:", error);
      }
    },
    [selectedVehicle, onImageUpload]
  );

  // Gestion du drag & drop pour les images
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0 && selectedVehicle) {
        setIsLoading(true);
        try {
          // Si c'est la première image, la définir comme image principale
          if (!selectedVehicle.featured_image && acceptedFiles.length === 1) {
            const uploadedImage = await onImageUpload(acceptedFiles[0]);
            setSelectedVehicle({
              ...selectedVehicle,
              image_url: uploadedImage.url,
              featured_image: {
                id: uploadedImage.id,
                url: uploadedImage.url,
                alt: selectedVehicle.title,
              },
            });
          } else {
            // Ajouter toutes les images à la galerie
            for (const file of acceptedFiles) {
              await addImageToGallery(file);
            }
          }
        } catch (error) {
          console.error('Erreur lors du téléchargement:', error);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [selectedVehicle, onImageUpload, addImageToGallery]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    multiple: true, // Permettre plusieurs fichiers
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  // Supprimer une image de la galerie
  const removeImageFromGallery = useCallback(
    async (imageId: number) => {
      if (!selectedVehicle) return;

      try {
        if (onImageDelete) {
          await onImageDelete(imageId);
        }

        const updatedGallery =
          selectedVehicle.gallery?.filter(img => img.id !== imageId) || [];
        setSelectedVehicle({
          ...selectedVehicle,
          gallery: updatedGallery,
        });
      } catch (error) {
        console.error("Erreur lors de la suppression de l'image:", error);
      }
    },
    [selectedVehicle, onImageDelete]
  );

  // Réorganiser les images
  const reorderImages = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (!selectedVehicle?.gallery) return;

      const updatedGallery = [...selectedVehicle.gallery];
      const [movedImage] = updatedGallery.splice(fromIndex, 1);
      updatedGallery.splice(toIndex, 0, movedImage);

      // Mettre à jour les ordres
      const reorderedGallery = updatedGallery.map((img, index) => ({
        ...img,
        order: index + 1,
      }));

      setSelectedVehicle({
        ...selectedVehicle,
        gallery: reorderedGallery,
      });
    },
    [selectedVehicle]
  );

  // Gestion du drag & drop pour la réorganisation
  const handleDragStart = (e: React.DragEvent, imageId: number) => {
    setDraggedImage(imageId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedImage === null || !selectedVehicle?.gallery) return;

    const draggedIndex = selectedVehicle.gallery.findIndex(
      img => img.id === draggedImage
    );
    if (draggedIndex !== -1 && draggedIndex !== targetIndex) {
      reorderImages(draggedIndex, targetIndex);
    }
    setDraggedImage(null);
  };

  const handleSave = async () => {
    if (selectedVehicle) {
      setIsLoading(true);
      try {
        await onSave(selectedVehicle);
        setIsEditing(false);
        setSelectedVehicle(null);
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      setIsLoading(true);
      try {
        await onDelete(id);
        if (selectedVehicle?.id === id) {
          setSelectedVehicle(null);
          setIsEditing(false);
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const startEditing = (vehicle?: Vehicle) => {
    if (vehicle) {
      setSelectedVehicle(vehicle);
    } else {
      setSelectedVehicle({
        title: '',
        content: '',
        price: 0,
        year: new Date().getFullYear(),
        mileage: 0,
        location: '',
        fuel_type: 'Essence',
        transmission: 'Automatique',
        power: '',
        description: '',
        is_featured: false,
        is_new: false,
        is_sold: false,
      });
    }
    setIsEditing(true);
  };

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>
                Gestion des Véhicules
              </h1>
              <p className='text-gray-600 mt-2'>
                Interface moderne avec drag & drop pour une productivité
                maximale
              </p>
            </div>
            <button
              onClick={() => startEditing()}
              className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2'
            >
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                />
              </svg>
              <span>Nouveau véhicule</span>
            </button>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Liste des véhicules */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-lg shadow-sm border'>
              <div className='p-4 border-b'>
                <h2 className='text-lg font-semibold text-gray-900'>
                  Véhicules ({vehicles.length})
                </h2>
              </div>
              <div className='max-h-96 overflow-y-auto'>
                {vehicles.map(vehicle => (
                  <div
                    key={vehicle.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedVehicle?.id === vehicle.id
                        ? 'bg-blue-50 border-blue-200'
                        : ''
                    }`}
                    onClick={() => setSelectedVehicle(vehicle)}
                  >
                    <div className='flex items-center space-x-3'>
                      {vehicle.featured_image?.url ? (
                        <Image
                          src={vehicle.featured_image.url}
                          alt={vehicle.title}
                          width={60}
                          height={40}
                          className='rounded object-cover'
                        />
                      ) : (
                        <div className='w-15 h-10 bg-gray-200 rounded flex items-center justify-center'>
                          <svg
                            className='w-6 h-6 text-gray-400'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                              d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                            />
                          </svg>
                        </div>
                      )}
                      <div className='flex-1 min-w-0'>
                        <h3 className='text-sm font-medium text-gray-900 truncate'>
                          {vehicle.title}
                        </h3>
                        <p className='text-sm text-gray-500'>
                          € {vehicle.price.toLocaleString()}
                        </p>
                        <div className='flex space-x-1 mt-1'>
                          {vehicle.is_featured && (
                            <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800'>
                              Vedette
                            </span>
                          )}
                          {vehicle.is_new && (
                            <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800'>
                              Neuf
                            </span>
                          )}
                          {vehicle.is_sold && (
                            <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800'>
                              Vendu
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Éditeur de véhicule */}
          <div className='lg:col-span-2'>
            {selectedVehicle ? (
              <div className='bg-white rounded-lg shadow-sm border'>
                <div className='p-6'>
                  <div className='flex justify-between items-center mb-6'>
                    <h2 className='text-xl font-semibold text-gray-900'>
                      {isEditing
                        ? 'Modifier le véhicule'
                        : 'Détails du véhicule'}
                    </h2>
                    <div className='flex space-x-2'>
                      {!isEditing ? (
                        <button
                          onClick={() => startEditing(selectedVehicle)}
                          className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
                        >
                          Modifier
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className='bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50'
                          >
                            {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                          </button>
                          <button
                            onClick={() => setIsEditing(false)}
                            className='bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors'
                          >
                            Annuler
                          </button>
                        </>
                      )}
                      {selectedVehicle.id && (
                        <button
                          onClick={() => handleDelete(selectedVehicle.id!)}
                          className='bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors'
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {/* Galerie d'images */}
                    <div className='md:col-span-2'>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Galerie d&apos;images du véhicule
                      </label>

                      {/* Zone de téléchargement */}
                      <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors mb-4 ${
                          isDragActive
                            ? 'border-blue-400 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <input {...getInputProps()} />
                        <div className='space-y-4'>
                          <svg
                            className='mx-auto h-12 w-12 text-gray-400'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                              d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                            />
                          </svg>
                          <div>
                            <p className='text-sm text-gray-600'>
                              Glissez des images ici ou cliquez pour
                              sélectionner
                            </p>
                            <p className='text-xs text-gray-500 mt-1'>
                              PNG, JPG, WEBP jusqu&apos;à 10MB • Plusieurs
                              fichiers autorisés
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Galerie d'images */}
                      {selectedVehicle.gallery &&
                        selectedVehicle.gallery.length > 0 && (
                          <div className='space-y-4'>
                            <div className='flex items-center justify-between'>
                              <h3 className='text-sm font-medium text-gray-700'>
                                Images ({selectedVehicle.gallery.length})
                              </h3>
                              <span className='text-xs text-gray-500'>
                                Glissez pour réorganiser • Cliquez sur ❌ pour
                                supprimer
                              </span>
                            </div>

                            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                              {selectedVehicle.gallery
                                .sort((a, b) => a.order - b.order)
                                .map((image, index) => (
                                  <div
                                    key={image.id}
                                    draggable={true}
                                    onDragStart={e =>
                                      handleDragStart(e, image.id)
                                    }
                                    onDragOver={handleDragOver}
                                    onDrop={e => handleDrop(e, index)}
                                    className={`relative group cursor-move ${
                                      draggedImage === image.id
                                        ? 'opacity-50'
                                        : ''
                                    }`}
                                  >
                                    <div className='relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-300 transition-colors'>
                                      <Image
                                        src={image.url}
                                        alt={image.alt}
                                        fill
                                        className='object-cover'
                                      />

                                      {/* Overlay avec contrôles */}
                                      <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center'>
                                        <div className='opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2'>
                                          <button
                                            onClick={() =>
                                              removeImageFromGallery(image.id)
                                            }
                                            className='bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors'
                                            title='Supprimer cette image'
                                          >
                                            <svg
                                              className='w-4 h-4'
                                              fill='none'
                                              stroke='currentColor'
                                              viewBox='0 0 24 24'
                                            >
                                              <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth='2'
                                                d='M6 18L18 6M6 6l12 12'
                                              />
                                            </svg>
                                          </button>

                                          <button
                                            onClick={() => {
                                              setSelectedVehicle({
                                                ...selectedVehicle,
                                                featured_image: {
                                                  id: image.id,
                                                  url: image.url,
                                                  alt: image.alt,
                                                },
                                                image_url: image.url,
                                              });
                                            }}
                                            className='bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors'
                                            title='Définir comme image principale'
                                          >
                                            <svg
                                              className='w-4 h-4'
                                              fill='none'
                                              stroke='currentColor'
                                              viewBox='0 0 24 24'
                                            >
                                              <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth='2'
                                                d='M5 13l4 4L19 7'
                                              />
                                            </svg>
                                          </button>
                                        </div>
                                      </div>

                                      {/* Indicateur d'ordre */}
                                      <div className='absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded'>
                                        #{image.order}
                                      </div>

                                      {/* Indicateur image principale */}
                                      {selectedVehicle.featured_image?.id ===
                                        image.id && (
                                        <div className='absolute top-2 right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded font-bold'>
                                          ⭐ Principale
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                      {/* Image principale actuelle */}
                      {selectedVehicle.featured_image && (
                        <div className='mt-4 p-4 bg-blue-50 rounded-lg'>
                          <h4 className='text-sm font-medium text-blue-900 mb-2'>
                            Image principale
                          </h4>
                          <div className='flex items-center space-x-3'>
                            <Image
                              src={selectedVehicle.featured_image.url}
                              alt={selectedVehicle.featured_image.alt}
                              width={60}
                              height={40}
                              className='rounded object-cover'
                            />
                            <div>
                              <p className='text-sm text-blue-800'>
                                {selectedVehicle.featured_image.alt}
                              </p>
                              <p className='text-xs text-blue-600'>
                                Image mise en avant
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Champs du formulaire */}
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Titre *
                      </label>
                      <input
                        type='text'
                        value={selectedVehicle.title}
                        onChange={e =>
                          setSelectedVehicle({
                            ...selectedVehicle,
                            title: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100'
                        placeholder='ex: BMW M3 Competition'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Prix (€) *
                      </label>
                      <input
                        type='number'
                        value={selectedVehicle.price}
                        onChange={e =>
                          setSelectedVehicle({
                            ...selectedVehicle,
                            price: parseInt(e.target.value) || 0,
                          })
                        }
                        disabled={!isEditing}
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100'
                        placeholder='95000'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Année *
                      </label>
                      <input
                        type='number'
                        value={selectedVehicle.year}
                        onChange={e =>
                          setSelectedVehicle({
                            ...selectedVehicle,
                            year: parseInt(e.target.value) || 0,
                          })
                        }
                        disabled={!isEditing}
                        min='1990'
                        max={new Date().getFullYear()}
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Kilométrage
                      </label>
                      <input
                        type='text'
                        value={selectedVehicle.mileage}
                        onChange={e =>
                          setSelectedVehicle({
                            ...selectedVehicle,
                            mileage: parseInt(e.target.value) || 0,
                          })
                        }
                        disabled={!isEditing}
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100'
                        placeholder='8200'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Localisation
                      </label>
                      <input
                        type='text'
                        value={selectedVehicle.location}
                        onChange={e =>
                          setSelectedVehicle({
                            ...selectedVehicle,
                            location: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100'
                        placeholder='Nice'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Type de carburant
                      </label>
                      <select
                        value={selectedVehicle.fuel_type}
                        onChange={e =>
                          setSelectedVehicle({
                            ...selectedVehicle,
                            fuel_type: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100'
                      >
                        <option value='Essence'>Essence</option>
                        <option value='Diesel'>Diesel</option>
                        <option value='Électrique'>Électrique</option>
                        <option value='Hybride'>Hybride</option>
                        <option value='GPL'>GPL</option>
                      </select>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Transmission
                      </label>
                      <select
                        value={selectedVehicle.transmission}
                        onChange={e =>
                          setSelectedVehicle({
                            ...selectedVehicle,
                            transmission: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100'
                      >
                        <option value='Manuelle'>Manuelle</option>
                        <option value='Automatique'>Automatique</option>
                        <option value='Semi-automatique'>
                          Semi-automatique
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Puissance
                      </label>
                      <input
                        type='text'
                        value={selectedVehicle.power}
                        onChange={e =>
                          setSelectedVehicle({
                            ...selectedVehicle,
                            power: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100'
                        placeholder='510 ch'
                      />
                    </div>

                    {/* Statuts */}
                    <div className='md:col-span-2'>
                      <label className='block text-sm font-medium text-gray-700 mb-3'>
                        Statut du véhicule
                      </label>
                      <div className='grid grid-cols-3 gap-4'>
                        <label className='flex items-center space-x-2'>
                          <input
                            type='checkbox'
                            checked={selectedVehicle.is_featured}
                            onChange={e =>
                              setSelectedVehicle({
                                ...selectedVehicle,
                                is_featured: e.target.checked,
                              })
                            }
                            disabled={!isEditing}
                            className='rounded border-gray-300 text-yellow-600 focus:ring-yellow-500'
                          />
                          <span className='text-sm text-gray-700'>Vedette</span>
                        </label>
                        <label className='flex items-center space-x-2'>
                          <input
                            type='checkbox'
                            checked={selectedVehicle.is_new}
                            onChange={e =>
                              setSelectedVehicle({
                                ...selectedVehicle,
                                is_new: e.target.checked,
                              })
                            }
                            disabled={!isEditing}
                            className='rounded border-gray-300 text-green-600 focus:ring-green-500'
                          />
                          <span className='text-sm text-gray-700'>Neuf</span>
                        </label>
                        <label className='flex items-center space-x-2'>
                          <input
                            type='checkbox'
                            checked={selectedVehicle.is_sold}
                            onChange={e =>
                              setSelectedVehicle({
                                ...selectedVehicle,
                                is_sold: e.target.checked,
                              })
                            }
                            disabled={!isEditing}
                            className='rounded border-gray-300 text-red-600 focus:ring-red-500'
                          />
                          <span className='text-sm text-gray-700'>Vendu</span>
                        </label>
                      </div>
                    </div>

                    {/* Description */}
                    <div className='md:col-span-2'>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Description
                      </label>
                      <textarea
                        value={selectedVehicle.content}
                        onChange={e =>
                          setSelectedVehicle({
                            ...selectedVehicle,
                            content: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        rows={4}
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100'
                        placeholder='Description du véhicule...'
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className='bg-white rounded-lg shadow-sm border p-12 text-center'>
                <svg
                  className='mx-auto h-12 w-12 text-gray-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                  />
                </svg>
                <h3 className='mt-2 text-sm font-medium text-gray-900'>
                  Aucun véhicule sélectionné
                </h3>
                <p className='mt-1 text-sm text-gray-500'>
                  Sélectionnez un véhicule dans la liste ou créez-en un nouveau.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
