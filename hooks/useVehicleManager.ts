import { useCallback, useEffect, useState } from 'react';

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

interface VehicleManagerHook {
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
  fetchVehicles: () => Promise<void>;
  saveVehicle: (vehicle: Vehicle) => Promise<void>;
  deleteVehicle: (id: number) => Promise<void>;
  uploadImage: (file: File) => Promise<{ id: number; url: string }>;
  deleteImage: (imageId: number) => Promise<void>;
}

export function useVehicleManager(): VehicleManagerHook {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les véhicules depuis WordPress
  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/vehicles');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des véhicules');
      }

      const data = await response.json();
      setVehicles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      console.error('Erreur fetchVehicles:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sauvegarder un véhicule
  const saveVehicle = useCallback(async (vehicle: Vehicle) => {
    setLoading(true);
    setError(null);

    try {
      const url = vehicle.id ? `/api/vehicles/${vehicle.id}` : '/api/vehicles';
      const method = vehicle.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicle),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde');
      }

      const savedVehicle = await response.json();

      if (vehicle.id) {
        // Mise à jour
        setVehicles(prev =>
          prev.map(v => (v.id === vehicle.id ? savedVehicle : v))
        );
      } else {
        // Création
        setVehicles(prev => [...prev, savedVehicle]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      console.error('Erreur saveVehicle:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Supprimer un véhicule
  const deleteVehicle = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/vehicles/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      setVehicles(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      console.error('Erreur deleteVehicle:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Télécharger une image
  const uploadImage = useCallback(
    async (file: File): Promise<{ id: number; url: string }> => {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Erreur lors du téléchargement de l'image");
        }

        const data = await response.json();
        return {
          id: data.id,
          url: data.url,
        };
      } catch (err) {
        console.error('Erreur uploadImage:', err);
        throw err;
      }
    },
    []
  );

  // Supprimer une image
  const deleteImage = useCallback(async (imageId: number): Promise<void> => {
    try {
      const response = await fetch(`/api/images/${imageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de l\'image');
      }
    } catch (err) {
      console.error('Erreur deleteImage:', err);
      throw err;
    }
  }, []);

  // Charger les véhicules au montage
  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return {
    vehicles,
    loading,
    error,
    fetchVehicles,
    saveVehicle,
    deleteVehicle,
    uploadImage,
    deleteImage,
  };
}
