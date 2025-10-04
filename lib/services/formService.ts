import { wordpressConfig } from '../../config/api';

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

export interface FormSubmission {
  id: number;
  type: 'contact' | 'vehicle_request' | 'testimonial';
  data: ContactFormData | VehicleRequestFormData;
  status: 'new' | 'read' | 'replied' | 'archived';
  date: string;
  ip?: string;
  userAgent?: string;
}

// Service pour gérer les formulaires
class FormService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = wordpressConfig.apiUrl;
  }

  // Soumettre un formulaire de contact
  async submitContactForm(data: ContactFormData): Promise<FormSubmission> {
    const response = await fetch(`${this.baseUrl}/form-submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: `Contact: ${data.name}`,
        content: data.message,
        status: 'publish',
        meta: {
          form_type: 'contact',
          form_data: data,
          submission_date: new Date().toISOString(),
        },
      }),
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
    const response = await fetch(`${this.baseUrl}/form-submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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

    const response = await fetch(
      `${this.baseUrl}/form-submissions?${queryParams}`
    );

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des soumissions');
    }

    return response.json();
  }

  // Marquer une soumission comme lue
  async markAsRead(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/form-submissions/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
}

export const formService = new FormService();
export default formService;
