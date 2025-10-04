import React, { useState, useRef } from 'react';

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // en MB
  acceptedTypes?: string[];
  label?: string;
  description?: string;
  required?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesChange,
  maxFiles = 5,
  maxSize = 10, // 10MB par défaut
  acceptedTypes = ['image/*', 'application/pdf'],
  label = 'Télécharger des fichiers',
  description,
  required = false
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Vérifier la taille
    if (file.size > maxSize * 1024 * 1024) {
      return `Le fichier ${file.name} dépasse la taille maximale de ${maxSize}MB`;
    }

    // Vérifier le type
    const isValidType = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });

    if (!isValidType) {
      return `Le fichier ${file.name} n'est pas d'un type accepté`;
    }

    return null;
  };

  const handleFiles = (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const newErrors: string[] = [];
    const validFiles: File[] = [];

    // Vérifier le nombre maximum de fichiers
    if (files.length + fileArray.length > maxFiles) {
      newErrors.push(`Maximum ${maxFiles} fichiers autorisés`);
      setErrors(newErrors);
      return;
    }

    // Valider chaque fichier
    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        newErrors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
    }

    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles];
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
      setErrors([]);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File): string => {
    if (file.type.startsWith('image/')) return '🖼️';
    if (file.type === 'application/pdf') return '📄';
    if (file.type.includes('word')) return '📝';
    if (file.type.includes('excel') || file.type.includes('spreadsheet')) return '📊';
    return '📎';
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {description && (
        <p className="text-sm text-gray-600 mb-4">{description}</p>
      )}

      {/* Zone de téléchargement */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-yellow-400 bg-yellow-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-2">
          <div className="text-4xl">📎</div>
          <div className="text-lg font-medium text-gray-900">
            Glissez-déposez vos fichiers ici
          </div>
          <div className="text-sm text-gray-600">
            ou{' '}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-yellow-600 hover:text-yellow-500 font-medium"
            >
              cliquez pour parcourir
            </button>
          </div>
          <div className="text-xs text-gray-500">
            Types acceptés: {acceptedTypes.join(', ')} • Max {maxSize}MB par fichier
          </div>
        </div>
      </div>

      {/* Liste des fichiers */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            Fichiers sélectionnés ({files.length}/{maxFiles})
          </h4>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{getFileIcon(file)}</span>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {file.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Messages d'erreur */}
      {errors.length > 0 && (
        <div className="mt-4 space-y-1">
          {errors.map((error, index) => (
            <div key={index} className="text-sm text-red-600">
              {error}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
