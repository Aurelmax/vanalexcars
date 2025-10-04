import Head from 'next/head';
import VehicleManager from '../components/admin/VehicleManager';
import { useVehicleManager } from '../hooks/useVehicleManager';

export default function AdminVehicles() {
  const {
    vehicles,
    loading,
    error,
    fetchVehicles,
    saveVehicle,
    deleteVehicle,
    uploadImage,
    deleteImage,
  } = useVehicleManager();

  return (
    <>
      <Head>
        <title>Gestion des Véhicules - Vanalexcars</title>
        <meta
          name='description'
          content='Interface moderne de gestion des véhicules avec drag & drop'
        />
      </Head>

      <VehicleManager
        vehicles={vehicles}
        onSave={saveVehicle}
        onDelete={deleteVehicle}
        onImageUpload={uploadImage}
        onImageDelete={deleteImage}
      />
    </>
  );
}
