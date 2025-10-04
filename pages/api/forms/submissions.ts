import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { form_type } = req.query;

  try {
    // Récupérer les soumissions depuis WordPress
    let url = 'http://172.22.0.3:80/wp-json/wp/v2/posts?meta_key=form_type';

    if (form_type) {
      url += `&meta_value=${form_type}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('WordPress submissions fetch error:', errorData);
      return res.status(response.status).json({
        error: 'Failed to fetch submissions',
        details: errorData,
      });
    }

    const data = await response.json();

    // Transformer les données pour le frontend
    const submissions = data.map((post: any) => ({
      id: post.id,
      title: post.title.rendered,
      content: post.content.rendered,
      date: post.date,
      status: post.status,
      form_type: post.meta?.form_type || 'unknown',
      form_data: post.meta?.form_data || {},
    }));

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
