import { authService } from './authService';

// Types pour les formulaires
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject?: string;
  vehicleId?: string;
}

export interface VehicleRequestFormData {
  name: string;
  email: string;
  phone: string;
  brand: string;
  model: string;
  year?: string;
  budget?: string;
  message: string;
}

export interface TestimonialFormData {
  name: string;
  email: string;
  location?: string;
  vehicle_purchased?: string;
  rating: number;
  title: string;
  testimonial: string;
  photos?: File[];
}

export interface NewsletterFormData {
  email: string;
  name?: string;
  interests?: string[];
}

export interface FormSubmission {
  id: number;
  type: 'contact' | 'vehicle_request' | 'testimonial' | 'newsletter';
  data:
    | ContactFormData
    | VehicleRequestFormData
    | TestimonialFormData
    | NewsletterFormData;
  status: 'new' | 'read' | 'replied' | 'archived';
  date: string;
  ip?: string;
  userAgent?: string;
}

// Service pour gérer les formulaires
class FormService {
  private baseUrl: string;

  constructor() {
    // Utiliser les endpoints Next.js pour éviter les problèmes CORS
    this.baseUrl = '/api/forms';
  }

  // Récupérer les soumissions de formulaires
  async getFormSubmissions(formType?: string): Promise<FormSubmission[]> {
    const url = formType
      ? `${this.baseUrl}/submissions?form_type=${formType}`
      : `${this.baseUrl}/submissions`;

    console.log('Tentative de récupération des soumissions vers:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Réponse reçue:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur de réponse:', errorText);
      throw new Error(
        `Erreur lors de la récupération des soumissions: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log('Données reçues:', data);
    return data.data || [];
  }

  // Soumettre un formulaire de contact
  async submitContactForm(data: ContactFormData): Promise<FormSubmission> {
    const response = await fetch(`${this.baseUrl}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'envoi du formulaire");
    }

    return response.json();
  }

  // Soumettre une demande de véhicule
  async submitVehicleRequest(
    data: VehicleRequestFormData
  ): Promise<FormSubmission> {
    const response = await fetch(`${this.baseUrl}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeaders(),
      },
      body: JSON.stringify({
        title: `Demande véhicule: ${data.brand} ${data.model}`,
        content: data.message,
        status: 'publish',
        meta: {
          form_type: 'vehicle_request',
          form_data: data,
          submission_date: new Date().toISOString(),
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'envoi de la demande");
    }

    return response.json();
  }

  // Récupérer les soumissions (admin)
  async getFormSubmissions(params?: {
    type?: string;
    status?: string;
    page?: number;
    per_page?: number;
  }): Promise<FormSubmission[]> {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('meta_key', 'form_type');
    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page)
      queryParams.append('per_page', params.per_page.toString());

    const response = await fetch(`${this.baseUrl}/submissions?${queryParams}`);

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des soumissions');
    }

    return response.json();
  }

  // Marquer une soumission comme lue
  async markAsRead(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/submissions/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeaders(),
      },
      body: JSON.stringify({
        meta: {
          form_status: 'read',
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour');
    }
  }

  // Envoyer un email de notification
  async sendNotificationEmail(submission: FormSubmission): Promise<void> {
    // Intégration avec un service d'email (SendGrid, Mailgun, etc.)
    // Ou utilisation de l'API WordPress pour envoyer des emails
    console.log('Email de notification envoyé pour:', submission);
  }

  // Soumettre des documents d'immatriculation
  async submitRegistrationDocuments(
    formData: FormData
  ): Promise<FormSubmission> {
    const response = await fetch(`${this.baseUrl}/posts`, {
      method: 'POST',
      body: formData, // Pas de Content-Type, laissez le navigateur le définir
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'envoi des documents");
    }

    return response.json();
  }

  // Soumettre un témoignage
  async submitTestimonial(data: TestimonialFormData): Promise<FormSubmission> {
    const response = await fetch(`${this.baseUrl}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeaders(),
      },
      body: JSON.stringify({
        title: data.title,
        content: data.testimonial,
        status: 'publish',
        meta: {
          form_type: 'testimonial',
          form_data: data,
          submission_date: new Date().toISOString(),
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'envoi du témoignage");
    }

    return response.json();
  }

  // S'inscrire à la newsletter
  async submitNewsletter(data: NewsletterFormData): Promise<FormSubmission> {
    const response = await fetch(`${this.baseUrl}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeaders(),
      },
      body: JSON.stringify({
        title: `Newsletter: ${data.email}`,
        content: `Inscription newsletter`,
        status: 'publish',
        meta: {
          form_type: 'newsletter',
          form_data: data,
          submission_date: new Date().toISOString(),
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'inscription à la newsletter");
    }

    return response.json();
  }
}

export const formService = new FormService();
export default formService;
