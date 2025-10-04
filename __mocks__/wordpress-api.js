// Mock pour les API WordPress
export const mockWordPressAPI = {
  // Mock pour les véhicules
  vehicles: {
    getVehicles: jest.fn(() =>
      Promise.resolve({
        success: true,
        data: [
          {
            id: 1,
            title: 'Porsche 911 Carrera',
            content: 'Véhicule de sport exceptionnel',
            meta: {
              price: '85000',
              year: '2023',
              mileage: '5000',
              fuel_type: 'Essence',
              transmission: 'Manuelle',
              images: [
                '/images/porsche-911-1.jpg',
                '/images/porsche-911-2.jpg',
              ],
            },
          },
          {
            id: 2,
            title: 'BMW M3 Competition',
            content: 'Berline sportive haute performance',
            meta: {
              price: '75000',
              year: '2022',
              mileage: '12000',
              fuel_type: 'Essence',
              transmission: 'Automatique',
              images: ['/images/bmw-m3-1.jpg'],
            },
          },
        ],
      })
    ),

    getVehicleById: jest.fn(id =>
      Promise.resolve({
        success: true,
        data: {
          id: parseInt(id),
          title: 'Porsche 911 Carrera',
          content: 'Véhicule de sport exceptionnel',
          meta: {
            price: '85000',
            year: '2023',
            mileage: '5000',
            fuel_type: 'Essence',
            transmission: 'Manuelle',
            images: ['/images/porsche-911-1.jpg', '/images/porsche-911-2.jpg'],
          },
        },
      })
    ),
  },

  // Mock pour les formulaires
  forms: {
    submitContact: jest.fn(() =>
      Promise.resolve({
        success: true,
        data: {
          id: 1,
          message: 'Message envoyé avec succès',
        },
      })
    ),

    submitVehicleRequest: jest.fn(() =>
      Promise.resolve({
        success: true,
        data: {
          id: 1,
          message: 'Demande de véhicule envoyée avec succès',
        },
      })
    ),

    submitTestimonial: jest.fn(() =>
      Promise.resolve({
        success: true,
        data: {
          id: 1,
          message: 'Témoignage envoyé avec succès',
        },
      })
    ),

    submitNewsletter: jest.fn(() =>
      Promise.resolve({
        success: true,
        data: {
          id: 1,
          message: 'Inscription à la newsletter réussie',
        },
      })
    ),

    submitRegistrationDocuments: jest.fn(() =>
      Promise.resolve({
        success: true,
        data: {
          id: 1,
          message: "Documents d'immatriculation envoyés avec succès",
        },
      })
    ),

    getFormSubmissions: jest.fn(() =>
      Promise.resolve({
        success: true,
        data: [
          {
            id: 1,
            form_type: 'contact',
            form_data: {
              name: 'John Doe',
              email: 'john@example.com',
              message: 'Test message',
            },
            form_status: 'new',
            submission_date: '2024-01-15T10:30:00Z',
          },
          {
            id: 2,
            form_type: 'vehicle_request',
            form_data: {
              name: 'Jane Smith',
              email: 'jane@example.com',
              vehicle_make: 'Porsche',
              vehicle_model: '911',
            },
            form_status: 'read',
            submission_date: '2024-01-14T15:45:00Z',
          },
        ],
      })
    ),
  },

  // Mock pour l'authentification
  auth: {
    authenticate: jest.fn(() =>
      Promise.resolve({
        success: true,
        data: {
          token: 'mock-jwt-token',
          user: {
            id: 1,
            username: 'admin',
            email: 'admin@vanalexcars.com',
          },
        },
      })
    ),

    logout: jest.fn(() =>
      Promise.resolve({
        success: true,
        message: 'Déconnexion réussie',
      })
    ),

    getCurrentUser: jest.fn(() =>
      Promise.resolve({
        success: true,
        data: {
          id: 1,
          username: 'admin',
          email: 'admin@vanalexcars.com',
        },
      })
    ),
  },
};

// Mock pour les erreurs API
export const mockAPIErrors = {
  networkError: new Error('Network Error'),
  unauthorizedError: new Error('Unauthorized'),
  validationError: new Error('Validation Error'),
  serverError: new Error('Internal Server Error'),
};

// Helper pour simuler des délais d'API
export const simulateAPIDelay = (ms = 1000) =>
  new Promise(resolve => setTimeout(resolve, ms));

// Helper pour simuler des erreurs
export const simulateAPIError = (errorType = 'networkError') => {
  return Promise.reject(mockAPIErrors[errorType]);
};
