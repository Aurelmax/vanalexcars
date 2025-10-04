import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import TestContactForm from '../components/forms/TestContactForm';
import TestFormSelector from '../components/forms/TestFormSelector';
import TestNewsletterForm from '../components/forms/TestNewsletterForm';
import TestRegistrationDocumentsForm from '../components/forms/TestRegistrationDocumentsForm';
import TestTestimonialForm from '../components/forms/TestTestimonialForm';
import TestVehicleRequestForm from '../components/forms/TestVehicleRequestForm';
import { formService } from '../lib/services/formService';

const TestFormulairesPage: React.FC = () => {
  const [selectedForm, setSelectedForm] = useState<string>('selector');
  const [submissionResults, setSubmissionResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les soumissions depuis WordPress
  const loadSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const submissions = await formService.getFormSubmissions();
      console.log('Soumissions reçues:', submissions);
      // S'assurer que submissions est un tableau
      setSubmissionResults(Array.isArray(submissions) ? submissions : []);
    } catch (err) {
      console.error('Erreur lors du chargement des soumissions:', err);
      setError('Erreur lors du chargement des soumissions');
    } finally {
      setLoading(false);
    }
  };

  // Charger les soumissions au montage du composant
  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleFormSubmit = (formType: string, data: any) => {
    const result = {
      id: Date.now(),
      type: formType,
      data: data,
      timestamp: new Date().toLocaleString(),
      status: 'success',
    };

    setSubmissionResults(prev => [result, ...prev]);
    console.log(`Formulaire ${formType} soumis:`, data);

    // Recharger les soumissions après soumission
    setTimeout(() => {
      loadSubmissions();
    }, 1000);
  };

  const renderForm = () => {
    switch (selectedForm) {
      case 'contact':
        return (
          <TestContactForm
            onSubmit={data => handleFormSubmit('contact', data)}
          />
        );
      case 'vehicle':
        return (
          <TestVehicleRequestForm
            onSubmit={data => handleFormSubmit('vehicle_request', data)}
          />
        );
      case 'documents':
        return (
          <TestRegistrationDocumentsForm
            onSubmit={data => handleFormSubmit('registration_documents', data)}
          />
        );
      case 'testimonial':
        return (
          <TestTestimonialForm
            onSubmit={data => handleFormSubmit('testimonial', data)}
          />
        );
      case 'newsletter':
        return (
          <TestNewsletterForm
            onSubmit={data => handleFormSubmit('newsletter', data)}
          />
        );
      default:
        return <TestFormSelector onFormSelect={setSelectedForm} />;
    }
  };

  return (
    <>
      <Head>
        <title>Test des Formulaires - Vanalexcars</title>
        <meta
          name='description'
          content='Page de test pour tous les formulaires Vanalexcars'
        />
      </Head>

      <Layout>
        <div className='min-h-screen bg-gray-50 py-8'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            {/* Header */}
            <div className='text-center mb-8'>
              <h1 className='text-4xl font-bold text-gray-900 mb-4'>
                🧪 Test des Formulaires Vanalexcars
              </h1>
              <p className='text-xl text-gray-600 mb-6'>
                Page de démonstration complète pour tester tous les formulaires
              </p>

              {/* Navigation des formulaires */}
              <div className='flex flex-wrap justify-center gap-4 mb-8'>
                <button
                  onClick={() => setSelectedForm('selector')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    selectedForm === 'selector'
                      ? 'bg-yellow-500 text-black'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  🏠 Sélecteur
                </button>
                <button
                  onClick={() => setSelectedForm('contact')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    selectedForm === 'contact'
                      ? 'bg-yellow-500 text-black'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  📞 Contact
                </button>
                <button
                  onClick={() => setSelectedForm('vehicle')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    selectedForm === 'vehicle'
                      ? 'bg-yellow-500 text-black'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  🚗 Véhicule
                </button>
                <button
                  onClick={() => setSelectedForm('documents')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    selectedForm === 'documents'
                      ? 'bg-yellow-500 text-black'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  📄 Documents
                </button>
                <button
                  onClick={() => setSelectedForm('testimonial')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    selectedForm === 'testimonial'
                      ? 'bg-yellow-500 text-black'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  ⭐ Témoignage
                </button>
                <button
                  onClick={() => setSelectedForm('newsletter')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    selectedForm === 'newsletter'
                      ? 'bg-yellow-500 text-black'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  📧 Newsletter
                </button>
              </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
              {/* Formulaire principal */}
              <div className='lg:col-span-2'>
                <div className='bg-white rounded-lg shadow-lg p-6'>
                  <div className='mb-6'>
                    <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                      {selectedForm === 'selector' &&
                        '🏠 Sélecteur de Formulaires'}
                      {selectedForm === 'contact' && '📞 Formulaire de Contact'}
                      {selectedForm === 'vehicle' && '🚗 Demande de Véhicule'}
                      {selectedForm === 'documents' &&
                        "📄 Documents d'Immatriculation"}
                      {selectedForm === 'testimonial' && '⭐ Témoignage Client'}
                      {selectedForm === 'newsletter' &&
                        '📧 Inscription Newsletter'}
                    </h2>
                    <p className='text-gray-600'>
                      {selectedForm === 'selector' &&
                        'Choisissez le type de formulaire à tester'}
                      {selectedForm === 'contact' &&
                        'Formulaire de contact général'}
                      {selectedForm === 'vehicle' &&
                        'Demande de véhicule spécifique'}
                      {selectedForm === 'documents' &&
                        "Téléchargement de documents d'immatriculation"}
                      {selectedForm === 'testimonial' &&
                        'Témoignage et avis client'}
                      {selectedForm === 'newsletter' &&
                        'Inscription à la newsletter'}
                    </p>
                  </div>

                  {renderForm()}
                </div>
              </div>

              {/* Panel de résultats */}
              <div className='lg:col-span-1'>
                <div className='bg-white rounded-lg shadow-lg p-6'>
                  <h3 className='text-xl font-bold text-gray-900 mb-4 flex items-center'>
                    <span className='w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3'>
                      ✓
                    </span>
                    Résultats des Tests
                  </h3>

                  {loading ? (
                    <div className='text-center py-8'>
                      <div className='text-4xl mb-4'>⏳</div>
                      <p className='text-gray-500'>
                        Chargement des soumissions...
                      </p>
                    </div>
                  ) : error ? (
                    <div className='text-center py-8'>
                      <div className='text-4xl mb-4'>❌</div>
                      <p className='text-red-500 mb-2'>{error}</p>
                      <button
                        onClick={loadSubmissions}
                        className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                      >
                        Réessayer
                      </button>
                    </div>
                  ) : submissionResults.length === 0 ? (
                    <div className='text-center py-8'>
                      <div className='text-4xl mb-4'>📝</div>
                      <p className='text-gray-500'>
                        Aucune soumission pour le moment
                      </p>
                      <p className='text-sm text-gray-400 mt-2'>
                        Soumettez un formulaire pour voir les résultats ici
                      </p>
                    </div>
                  ) : (
                    <div className='space-y-4'>
                      {Array.isArray(submissionResults) &&
                        submissionResults.map((result, index) => (
                          <div
                            key={result.id}
                            className='border border-gray-200 rounded-lg p-4'
                          >
                            <div className='flex items-center justify-between mb-2'>
                              <span className='text-sm font-semibold text-gray-900'>
                                {result.type === 'contact' && '📞 Contact'}
                                {result.type === 'vehicle_request' &&
                                  '🚗 Véhicule'}
                                {result.type === 'registration_documents' &&
                                  '📄 Documents'}
                                {result.type === 'testimonial' &&
                                  '⭐ Témoignage'}
                                {result.type === 'newsletter' &&
                                  '📧 Newsletter'}
                              </span>
                              <span className='text-xs text-gray-500'>
                                {result.timestamp}
                              </span>
                            </div>
                            <div className='text-sm text-gray-600'>
                              {result.type === 'contact' &&
                                `Nom: ${result.data.name}, Email: ${result.data.email}`}
                              {result.type === 'vehicle_request' &&
                                `Nom: ${result.data.name}, Véhicule: ${result.data.brand} ${result.data.model}`}
                              {result.type === 'registration_documents' &&
                                `Nom: ${result.data.fullName}, Documents: ${Object.keys(result.data.documents).length} types`}
                              {result.type === 'testimonial' &&
                                `Nom: ${result.data.name}, Note: ${result.data.rating}/5`}
                              {result.type === 'newsletter' &&
                                `Email: ${result.data.email}`}
                            </div>
                            <div className='mt-2'>
                              <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                                ✓ Soumis avec succès
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  {submissionResults.length > 0 && (
                    <div className='mt-6 pt-4 border-t border-gray-200'>
                      <button
                        onClick={() => setSubmissionResults([])}
                        className='w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors'
                      >
                        🗑️ Effacer les résultats
                      </button>
                    </div>
                  )}
                </div>

                {/* Instructions de test */}
                <div className='mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4'>
                  <h4 className='font-semibold text-blue-800 mb-2'>
                    💡 Instructions de test
                  </h4>
                  <ul className='text-sm text-blue-700 space-y-1'>
                    <li>• Testez chaque formulaire</li>
                    <li>• Vérifiez la validation</li>
                    <li>• Observez les résultats</li>
                    <li>• Testez l'upload de fichiers</li>
                    <li>• Vérifiez le backoffice WordPress</li>
                  </ul>
                </div>

                {/* Liens utiles */}
                <div className='mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
                  <h4 className='font-semibold text-yellow-800 mb-2'>
                    🔗 Liens utiles
                  </h4>
                  <div className='space-y-2 text-sm'>
                    <a
                      href='http://localhost:8080/wp-admin/admin.php?page=vanalexcars-forms'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='block text-yellow-700 hover:text-yellow-900 underline'
                    >
                      📊 Backoffice WordPress
                    </a>
                    <a
                      href='http://localhost:8080/wp-admin/'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='block text-yellow-700 hover:text-yellow-900 underline'
                    >
                      🔧 Admin WordPress
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default TestFormulairesPage;
