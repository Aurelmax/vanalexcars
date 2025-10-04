import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { form_type } = req.query;

  try {
    // Lire les soumissions depuis le fichier local
    const submissionsPath = path.join(process.cwd(), 'lib', 'submissions.json');
    let submissions = [];

    try {
      const data = fs.readFileSync(submissionsPath, 'utf8');
      submissions = JSON.parse(data);
    } catch (error) {
      // Fichier n'existe pas encore, retourner un tableau vide
      submissions = [];
    }

    // Filtrer par type de formulaire si spécifié
    if (form_type) {
      submissions = submissions.filter(
        submission => submission.form_type === form_type
      );
    }

    return res.status(200).json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    console.error('Submissions fetch proxy error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
