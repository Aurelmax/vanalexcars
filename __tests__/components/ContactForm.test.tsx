import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '../../components/forms/ContactForm';

// Mock the form service
jest.mock('../../lib/services/formService', () => ({
  formService: {
    submitContact: jest.fn(),
  },
}));

// Mock fetch
global.fetch = jest.fn();

describe('ContactForm', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders contact form with all required fields', () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/nom complet/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/téléphone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sujet/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /envoyer/i })
    ).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<ContactForm />);

    const submitButton = screen.getByRole('button', { name: /envoyer/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/le nom est requis/i)).toBeInTheDocument();
      expect(screen.getByText(/l'email est requis/i)).toBeInTheDocument();
      expect(screen.getByText(/le message est requis/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    render(<ContactForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /envoyer/i });

    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/format d'email invalide/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const mockSubmit = jest.fn().mockResolvedValue({
      success: true,
      data: { id: 1, message: 'Message envoyé avec succès' },
    });

    const { formService } = require('../../lib/services/formService');
    formService.submitContact = mockSubmit;

    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/nom complet/i);
    const emailInput = screen.getByLabelText(/email/i);
    const phoneInput = screen.getByLabelText(/téléphone/i);
    const subjectSelect = screen.getByLabelText(/sujet/i);
    const messageTextarea = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole('button', { name: /envoyer/i });

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(phoneInput, '+33123456789');
    await user.selectOptions(subjectSelect, 'general');
    await user.type(messageTextarea, 'Test message');

    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+33123456789',
        subject: 'general',
        message: 'Test message',
      });
    });
  });

  it('shows loading state during submission', async () => {
    const mockSubmit = jest
      .fn()
      .mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 1000))
      );

    const { formService } = require('../../lib/services/formService');
    formService.submitContact = mockSubmit;

    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/nom complet/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageTextarea = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole('button', { name: /envoyer/i });

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(messageTextarea, 'Test message');

    await user.click(submitButton);

    expect(screen.getByText(/envoi en cours/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('handles submission error', async () => {
    const mockSubmit = jest
      .fn()
      .mockRejectedValue(new Error('Submission failed'));

    const { formService } = require('../../lib/services/formService');
    formService.submitContact = mockSubmit;

    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/nom complet/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageTextarea = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole('button', { name: /envoyer/i });

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(messageTextarea, 'Test message');

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/erreur lors de l'envoi/i)).toBeInTheDocument();
    });
  });

  it('resets form after successful submission', async () => {
    const mockSubmit = jest.fn().mockResolvedValue({
      success: true,
      data: { id: 1, message: 'Message envoyé avec succès' },
    });

    const { formService } = require('../../lib/services/formService');
    formService.submitContact = mockSubmit;

    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/nom complet/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageTextarea = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole('button', { name: /envoyer/i });

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(messageTextarea, 'Test message');

    await user.click(submitButton);

    await waitFor(() => {
      expect(nameInput).toHaveValue('');
      expect(emailInput).toHaveValue('');
      expect(messageTextarea).toHaveValue('');
    });
  });
});
