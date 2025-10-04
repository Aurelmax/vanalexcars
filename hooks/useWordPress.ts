import { useCallback, useEffect, useState } from 'react';
import {
  WordPressCategory,
  WordPressMedia,
  WordPressPost,
  WordPressTag,
  wordpressService,
} from '../lib/services/wordpressService';

// Hook pour les posts WordPress
export function useWordPressPosts(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  categories?: number[];
  tags?: number[];
  author?: number;
  orderby?: string;
  order?: 'asc' | 'desc';
}) {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await wordpressService.getPosts(params);
      setPosts(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erreur lors du chargement des posts'
      );
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, loading, error, refetch: fetchPosts };
}

// Hook pour un post spécifique
export function useWordPressPost(id: number) {
  const [post, setPost] = useState<WordPressPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await wordpressService.getPost(id);
      setPost(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erreur lors du chargement du post'
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id, fetchPost]);

  return { post, loading, error, refetch: fetchPost };
}

// Hook pour les pages WordPress
export function useWordPressPages(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  parent?: number;
  orderby?: string;
  order?: 'asc' | 'desc';
}) {
  const [pages, setPages] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await wordpressService.getPages(params);
      setPages(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erreur lors du chargement des pages'
      );
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  return { pages, loading, error, refetch: fetchPages };
}

// Hook pour les médias WordPress
export function useWordPressMedia(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  media_type?: string;
  mime_type?: string;
  parent?: number;
}) {
  const [media, setMedia] = useState<WordPressMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await wordpressService.getMedia(params);
      setMedia(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erreur lors du chargement des médias'
      );
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  return { media, loading, error, refetch: fetchMedia };
}

// Hook pour les catégories WordPress
export function useWordPressCategories(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  exclude?: number[];
  include?: number[];
  orderby?: string;
  order?: 'asc' | 'desc';
  hide_empty?: boolean;
  parent?: number;
  post?: number;
  slug?: string;
}) {
  const [categories, setCategories] = useState<WordPressCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await wordpressService.getCategories(params);
      setCategories(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erreur lors du chargement des catégories'
      );
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
}

// Hook pour les tags WordPress
export function useWordPressTags(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  exclude?: number[];
  include?: number[];
  orderby?: string;
  order?: 'asc' | 'desc';
  hide_empty?: boolean;
  post?: number;
  slug?: string;
}) {
  const [tags, setTags] = useState<WordPressTag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await wordpressService.getTags(params);
      setTags(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erreur lors du chargement des tags'
      );
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return { tags, loading, error, refetch: fetchTags };
}

// Hook pour les véhicules (Custom Post Type)
export function useWordPressVehicles(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  orderby?: string;
  order?: 'asc' | 'desc';
  featured?: boolean;
  is_new?: boolean;
}) {
  const [vehicles, setVehicles] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await wordpressService.getVehicles(params);
      setVehicles(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erreur lors du chargement des véhicules'
      );
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return { vehicles, loading, error, refetch: fetchVehicles };
}

// Hook pour les témoignages (Custom Post Type)
export function useWordPressTestimonials(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  orderby?: string;
  order?: 'asc' | 'desc';
}) {
  const [testimonials, setTestimonials] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await wordpressService.getTestimonials(params);
      setTestimonials(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erreur lors du chargement des témoignages'
      );
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  return { testimonials, loading, error, refetch: fetchTestimonials };
}

// Hook pour les FAQ (Custom Post Type)
export function useWordPressFAQs(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  orderby?: string;
  order?: 'asc' | 'desc';
}) {
  const [faqs, setFaqs] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFAQs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await wordpressService.getFAQs(params);
      setFaqs(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erreur lors du chargement des FAQ'
      );
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchFAQs();
  }, [fetchFAQs]);

  return { faqs, loading, error, refetch: fetchFAQs };
}

// Hook pour les services (Custom Post Type)
export function useWordPressServices(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  orderby?: string;
  order?: 'asc' | 'desc';
}) {
  const [services, setServices] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await wordpressService.getServices(params);
      setServices(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erreur lors du chargement des services'
      );
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return { services, loading, error, refetch: fetchServices };
}

export default {
  useWordPressPosts,
  useWordPressPost,
  useWordPressPages,
  useWordPressMedia,
  useWordPressCategories,
  useWordPressTags,
  useWordPressVehicles,
  useWordPressTestimonials,
  useWordPressFAQs,
  useWordPressServices,
};
