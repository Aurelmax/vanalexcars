import React, { useState } from 'react';
import FileUpload from './FileUpload';

const FileUploadDemo: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
    console.log('Fichiers sélectionnés:', newFiles);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
        Démonstration des zones de téléchargement
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Zone 1: Pièce d'identité */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center mb-3">
            <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
              1
            </div>
            <span className="font-medium text-gray-900">Pièce d'identité</span>
          </div>
          <FileUpload
            onFilesChange={handleFilesChange}
            maxFiles={2}
            maxSize={5}
            acceptedTypes={['image/*', 'application/pdf']}
            label=""
            description="Carte d'identité, passeport ou permis de conduire"
            required
          />
        </div>

        {/* Zone 2: Justificatif de domicile */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center mb-3">
            <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
              2
            </div>
            <span className="font-medium text-gray-900">Justificatif de domicile</span>
            <div className="ml-2 text-yellow-600">✓</div>
          </div>
          <FileUpload
            onFilesChange={handleFilesChange}
            maxFiles={2}
            maxSize={5}
            acceptedTypes={['image/*', 'application/pdf']}
            label=""
            description="Facture EDF, téléphone, assurance, etc."
            required
          />
        </div>

        {/* Zone 3: Mandat */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center mb-3">
            <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
              3
            </div>
            <span className="font-medium text-gray-900">Le mandat</span>
          </div>
          <FileUpload
            onFilesChange={handleFilesChange}
            maxFiles={1}
            maxSize={5}
            acceptedTypes={['image/*', 'application/pdf']}
            label=""
            description="Document de mandat signé"
            required
          />
        </div>
      </div>

      {/* Résumé des fichiers téléchargés */}
      {files.length > 0 && (
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
            <span className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">
              ✓
            </span>
            Fichiers téléchargés ({files.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file, index) => (
              <div key={index} className="bg-white rounded-lg border border-green-200 p-3">
                <div className="flex items-center mb-2">
                  <span className="text-lg mr-2">
                    {file.type.startsWith('image/') ? '🖼️' : '📄'}
                  </span>
                  <span className="text-sm font-medium text-gray-900 flex-1 truncate">
                    {file.name}
                  </span>
                  <button
                    onClick={() => setFiles(files.filter((_, i) => i !== index))}
                    className="text-red-500 hover:text-red-700 text-xs ml-2"
                  >
                    ✕
                  </button>
                </div>
                <div className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">
          💡 Instructions de test
        </h3>
        <ul className="text-sm text-yellow-700 space-y-2">
          <li>• Glissez-déposez des fichiers dans les zones</li>
          <li>• Ou cliquez pour parcourir vos fichiers</li>
          <li>• Types acceptés : Images (JPG, PNG, etc.) et PDF</li>
          <li>• Taille maximale : 5MB par fichier</li>
          <li>• Maximum 2 fichiers par zone (sauf mandat : 1 fichier)</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUploadDemo;
