import { wordpressConfig } from '../../config/api';

// Types pour WordPress
export interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: any;
  categories: number[];
  tags: number[];
  _links: any;
}

export interface WordPressMedia {
  id: number;
  date: string;
  slug: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  author: number;
  comment_status: string;
  ping_status: string;
  template: string;
  meta: any;
  description: {
    rendered: string;
  };
  caption: {
    rendered: string;
  };
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    sizes: any;
  };
  source_url: string;
  _links: any;
}

export interface WordPressCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: any;
  _links: any;
}

export interface WordPressTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  meta: any;
  _links: any;
}

// Service WordPress
class WordPressService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = wordpressConfig.apiUrl;
  }

  // Méthodes génériques
  private async fetchFromWordPress<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `WordPress API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  // Posts
  async getPosts(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    categories?: number[];
    tags?: number[];
    author?: number;
    orderby?: string;
    order?: 'asc' | 'desc';
  }): Promise<WordPressPost[]> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.per_page)
      searchParams.append('per_page', params.per_page.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.categories)
      searchParams.append('categories', params.categories.join(','));
    if (params?.tags) searchParams.append('tags', params.tags.join(','));
    if (params?.author) searchParams.append('author', params.author.toString());
    if (params?.orderby) searchParams.append('orderby', params.orderby);
    if (params?.order) searchParams.append('order', params.order);

    const queryString = searchParams.toString();
    const endpoint = `/posts${queryString ? `?${queryString}` : ''}`;

    return this.fetchFromWordPress<WordPressPost[]>(endpoint);
  }

  async getPost(id: number): Promise<WordPressPost> {
    return this.fetchFromWordPress<WordPressPost>(`/posts/${id}`);
  }

  async getPostBySlug(slug: string): Promise<WordPressPost[]> {
    return this.fetchFromWordPress<WordPressPost[]>(`/posts?slug=${slug}`);
  }

  // Pages
  async getPages(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    parent?: number;
    orderby?: string;
    order?: 'asc' | 'desc';
  }): Promise<WordPressPost[]> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.per_page)
      searchParams.append('per_page', params.per_page.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.parent) searchParams.append('parent', params.parent.toString());
    if (params?.orderby) searchParams.append('orderby', params.orderby);
    if (params?.order) searchParams.append('order', params.order);

    const queryString = searchParams.toString();
    const endpoint = `/pages${queryString ? `?${queryString}` : ''}`;

    return this.fetchFromWordPress<WordPressPost[]>(endpoint);
  }

  async getPage(id: number): Promise<WordPressPost> {
    return this.fetchFromWordPress<WordPressPost>(`/pages/${id}`);
  }

  // Media
  async getMedia(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    media_type?: string;
    mime_type?: string;
    parent?: number;
  }): Promise<WordPressMedia[]> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.per_page)
      searchParams.append('per_page', params.per_page.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.media_type)
      searchParams.append('media_type', params.media_type);
    if (params?.mime_type) searchParams.append('mime_type', params.mime_type);
    if (params?.parent) searchParams.append('parent', params.parent.toString());

    const queryString = searchParams.toString();
    const endpoint = `/media${queryString ? `?${queryString}` : ''}`;

    return this.fetchFromWordPress<WordPressMedia[]>(endpoint);
  }

  async getMediaById(id: number): Promise<WordPressMedia> {
    return this.fetchFromWordPress<WordPressMedia>(`/media/${id}`);
  }

  // Categories
  async getCategories(params?: {
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
  }): Promise<WordPressCategory[]> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.per_page)
      searchParams.append('per_page', params.per_page.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.exclude)
      searchParams.append('exclude', params.exclude.join(','));
    if (params?.include)
      searchParams.append('include', params.include.join(','));
    if (params?.orderby) searchParams.append('orderby', params.orderby);
    if (params?.order) searchParams.append('order', params.order);
    if (params?.hide_empty !== undefined)
      searchParams.append('hide_empty', params.hide_empty.toString());
    if (params?.parent) searchParams.append('parent', params.parent.toString());
    if (params?.post) searchParams.append('post', params.post.toString());
    if (params?.slug) searchParams.append('slug', params.slug);

    const queryString = searchParams.toString();
    const endpoint = `/categories${queryString ? `?${queryString}` : ''}`;

    return this.fetchFromWordPress<WordPressCategory[]>(endpoint);
  }

  async getCategory(id: number): Promise<WordPressCategory> {
    return this.fetchFromWordPress<WordPressCategory>(`/categories/${id}`);
  }

  // Tags
  async getTags(params?: {
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
  }): Promise<WordPressTag[]> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.per_page)
      searchParams.append('per_page', params.per_page.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.exclude)
      searchParams.append('exclude', params.exclude.join(','));
    if (params?.include)
      searchParams.append('include', params.include.join(','));
    if (params?.orderby) searchParams.append('orderby', params.orderby);
    if (params?.order) searchParams.append('order', params.order);
    if (params?.hide_empty !== undefined)
      searchParams.append('hide_empty', params.hide_empty.toString());
    if (params?.post) searchParams.append('post', params.post.toString());
    if (params?.slug) searchParams.append('slug', params.slug);

    const queryString = searchParams.toString();
    const endpoint = `/tags${queryString ? `?${queryString}` : ''}`;

    return this.fetchFromWordPress<WordPressTag[]>(endpoint);
  }

  async getTag(id: number): Promise<WordPressTag> {
    return this.fetchFromWordPress<WordPressTag>(`/tags/${id}`);
  }

  // Custom Post Types (pour Vanalexcars)
  async getVehicles(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    orderby?: string;
    order?: 'asc' | 'desc';
  }): Promise<WordPressPost[]> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.per_page)
      searchParams.append('per_page', params.per_page.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.orderby) searchParams.append('orderby', params.orderby);
    if (params?.order) searchParams.append('order', params.order);

    const queryString = searchParams.toString();
    const endpoint = `/vehicles${queryString ? `?${queryString}` : ''}`;

    return this.fetchFromWordPress<WordPressPost[]>(endpoint);
  }

  async getTestimonials(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    orderby?: string;
    order?: 'asc' | 'desc';
  }): Promise<WordPressPost[]> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.per_page)
      searchParams.append('per_page', params.per_page.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.orderby) searchParams.append('orderby', params.orderby);
    if (params?.order) searchParams.append('order', params.order);

    const queryString = searchParams.toString();
    const endpoint = `/testimonials${queryString ? `?${queryString}` : ''}`;

    return this.fetchFromWordPress<WordPressPost[]>(endpoint);
  }

  async getFAQs(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    orderby?: string;
    order?: 'asc' | 'desc';
  }): Promise<WordPressPost[]> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.per_page)
      searchParams.append('per_page', params.per_page.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.orderby) searchParams.append('orderby', params.orderby);
    if (params?.order) searchParams.append('order', params.order);

    const queryString = searchParams.toString();
    const endpoint = `/faqs${queryString ? `?${queryString}` : ''}`;

    return this.fetchFromWordPress<WordPressPost[]>(endpoint);
  }

  async getServices(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    orderby?: string;
    order?: 'asc' | 'desc';
  }): Promise<WordPressPost[]> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.per_page)
      searchParams.append('per_page', params.per_page.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.orderby) searchParams.append('orderby', params.orderby);
    if (params?.order) searchParams.append('order', params.order);

    const queryString = searchParams.toString();
    const endpoint = `/services${queryString ? `?${queryString}` : ''}`;

    return this.fetchFromWordPress<WordPressPost[]>(endpoint);
  }
}

export const wordpressService = new WordPressService();
export default wordpressService;
