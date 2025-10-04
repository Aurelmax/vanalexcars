import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ error: 'Name, email and message are required' });
  }

  try {
    // Utiliser l'endpoint personnalisé WordPress pour les soumissions
    const response = await fetch(
      'http://172.22.0.3:80/wp-json/vanalexcars/v1/submit-form',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          form_type: 'contact',
          form_data: { name, email, phone, message },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('WordPress form submission error:', errorData);
      return res.status(response.status).json({
        error: 'Form submission failed',
        details: errorData,
      });
    }

    const data = await response.json();
    return res.status(200).json({
      success: true,
      data: {
        id: data.id,
        title: data.title,
        message: 'Formulaire de contact soumis avec succès',
      },
    });
  } catch (error) {
    console.error('Form submission proxy error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
