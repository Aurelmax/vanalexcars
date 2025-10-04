import {
  mockWordPressAPI,
  simulateAPIError,
} from '../../__mocks__/wordpress-api';
import { formService } from '../../lib/services/formService';

// Mock fetch
global.fetch = jest.fn();

describe('FormService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
  });

  describe('submitContact', () => {
    it('should submit contact form successfully', async () => {
      const mockData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+33123456789',
        message: 'Test message',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockWordPressAPI.forms.submitContact()),
      });

      const result = await formService.submitContact(mockData);

      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/forms/contact'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(mockData),
        })
      );
    });

    it('should handle contact form submission error', async () => {
      const mockData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message',
      };

      (global.fetch as jest.Mock).mockRejectedValueOnce(
        simulateAPIError('networkError')
      );

      await expect(formService.submitContact(mockData)).rejects.toThrow(
        'Network Error'
      );
    });
  });

  describe('submitVehicleRequest', () => {
    it('should submit vehicle request successfully', async () => {
      const mockData = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+33987654321',
        vehicle_make: 'Porsche',
        vehicle_model: '911',
        vehicle_year: '2023',
        budget: '80000',
        message: 'Looking for a sports car',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve(mockWordPressAPI.forms.submitVehicleRequest()),
      });

      const result = await formService.submitVehicleRequest(mockData);

      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/forms/vehicle-request'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(mockData),
        })
      );
    });
  });

  describe('submitTestimonial', () => {
    it('should submit testimonial successfully', async () => {
      const mockData = {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        location: 'Nice',
        vehicle_purchased: 'Porsche 911',
        rating: 5,
        title: 'Excellent service',
        testimonial: 'Great experience with Vanalexcars',
        photos: [],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockWordPressAPI.forms.submitTestimonial()),
      });

      const result = await formService.submitTestimonial(mockData);

      expect(result.success).toBe(true);
    });
  });

  describe('submitNewsletter', () => {
    it('should submit newsletter subscription successfully', async () => {
      const mockData = {
        email: 'newsletter@example.com',
        name: 'Newsletter Subscriber',
        interests: ['luxury_cars', 'sports_cars'],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockWordPressAPI.forms.submitNewsletter()),
      });

      const result = await formService.submitNewsletter(mockData);

      expect(result.success).toBe(true);
    });
  });

  describe('submitRegistrationDocuments', () => {
    it('should submit registration documents successfully', async () => {
      const mockData = {
        name: 'Document User',
        email: 'documents@example.com',
        phone: '+33555666777',
        request_type: 'search',
        urgency: 'medium',
        message: 'Need help with registration',
        documents: {
          identity: [],
          proof_of_address: [],
          mandate: [],
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve(mockWordPressAPI.forms.submitRegistrationDocuments()),
      });

      const result = await formService.submitRegistrationDocuments(mockData);

      expect(result.success).toBe(true);
    });
  });

  describe('getFormSubmissions', () => {
    it('should fetch form submissions successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve(mockWordPressAPI.forms.getFormSubmissions()),
      });

      const result = await formService.getFormSubmissions();

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data).toHaveLength(2);
    });

    it('should handle form submissions fetch error', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        simulateAPIError('serverError')
      );

      await expect(formService.getFormSubmissions()).rejects.toThrow(
        'Internal Server Error'
      );
    });
  });
});
