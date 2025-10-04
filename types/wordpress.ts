// Types WordPress Headless - Entités principales

// Base types
export interface WordPressBase {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: 'publish' | 'draft' | 'private' | 'pending' | 'future' | 'trash';
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
  parent: number;
  menu_order: number;
  comment_status: 'open' | 'closed';
  ping_status: 'open' | 'closed';
  template: string;
  meta: Record<string, any>;
  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
    about: Array<{ href: string }>;
    author: Array<{ embeddable: boolean; href: string }>;
    replies: Array<{ embeddable: boolean; href: string }>;
    'version-history': Array<{ count: number; href: string }>;
    'predecessor-version': Array<{ id: number; href: string }>;
    'wp:attachment': Array<{ href: string }>;
    'wp:term': Array<{ taxonomy: string; embeddable: boolean; href: string }>;
    curies: Array<{ name: string; href: string; templated: boolean }>;
  };
}

// Post types
export interface WordPressPost extends WordPressBase {
  type: 'post';
  format:
    | 'standard'
    | 'aside'
    | 'chat'
    | 'gallery'
    | 'link'
    | 'image'
    | 'quote'
    | 'status'
    | 'video'
    | 'audio';
  sticky: boolean;
  categories: number[];
  tags: number[];
}

// Page types
export interface WordPressPage extends WordPressBase {
  type: 'page';
  parent: number;
  menu_order: number;
}

// User types
export interface WordPressUser {
  id: number;
  username: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  url: string;
  description: string;
  link: string;
  locale: string;
  nickname: string;
  slug: string;
  registered_date: string;
  roles: string[];
  capabilities: Record<string, boolean>;
  extra_capabilities: Record<string, boolean>;
  avatar_urls: {
    '24': string;
    '48': string;
    '96': string;
  };
  meta: Record<string, any>;
  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
  };
}

// Media types
export interface WordPressMedia {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: 'inherit' | 'private' | 'trash';
  type: 'attachment';
  link: string;
  title: {
    rendered: string;
  };
  author: number;
  comment_status: 'open' | 'closed';
  ping_status: 'open' | 'closed';
  template: string;
  meta: Record<string, any>;
  description: {
    rendered: string;
  };
  caption: {
    rendered: string;
  };
  alt_text: string;
  media_type: 'image' | 'video' | 'audio' | 'application';
  mime_type: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    sizes: Record<
      string,
      {
        file: string;
        width: number;
        height: number;
        mime_type: string;
        source_url: string;
      }
    >;
    image_meta: {
      aperture: string;
      credit: string;
      camera: string;
      caption: string;
      created_timestamp: string;
      copyright: string;
      focal_length: string;
      iso: string;
      shutter_speed: string;
      title: string;
      orientation: string;
      keywords: string[];
    };
  };
  source_url: string;
  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
    about: Array<{ href: string }>;
    author: Array<{ embeddable: boolean; href: string }>;
    replies: Array<{ embeddable: boolean; href: string }>;
  };
}

// Category types
export interface WordPressCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: 'category';
  parent: number;
  meta: Record<string, any>;
  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
    about: Array<{ href: string }>;
    'wp:post_type': Array<{ href: string }>;
    curies: Array<{ name: string; href: string; templated: boolean }>;
  };
}

// Tag types
export interface WordPressTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: 'post_tag';
  meta: Record<string, any>;
  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
    about: Array<{ href: string }>;
    'wp:post_type': Array<{ href: string }>;
    curies: Array<{ name: string; href: string; templated: boolean }>;
  };
}

// Comment types
export interface WordPressComment {
  id: number;
  post: number;
  parent: number;
  author: number;
  author_name: string;
  author_email: string;
  author_url: string;
  author_ip: string;
  author_user_agent: string;
  date: string;
  date_gmt: string;
  content: {
    rendered: string;
  };
  link: string;
  status: 'hold' | 'approve' | 'spam' | 'trash';
  type: 'comment' | 'trackback' | 'pingback';
  author_avatar_urls: {
    '24': string;
    '48': string;
    '96': string;
  };
  meta: Record<string, any>;
  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
    up: Array<{ embeddable: boolean; href: string }>;
    'wp:post': Array<{ embeddable: boolean; href: string }>;
    'wp:parent': Array<{ embeddable: boolean; href: string }>;
    'wp:children': Array<{ embeddable: boolean; href: string }>;
    'wp:author': Array<{ embeddable: boolean; href: string }>;
    'wp:in-reply-to': Array<{ embeddable: boolean; href: string }>;
    curies: Array<{ name: string; href: string; templated: boolean }>;
  };
}

// Custom Post Types pour Vanalexcars
export interface VanalexcarsForfait {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: 'publish' | 'draft';
  featured_media: number;
  meta: {
    prix: string;
    description_courte: string;
    services_inclus: string[];
    is_popular: boolean;
    is_vip: boolean;
    ordre_affichage: number;
  };
  categories: number[];
  tags: number[];
  date: string;
  modified: string;
}

export interface VanalexcarsVehicule {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: 'publish' | 'draft';
  featured_media: number;
  meta: {
    marque: string;
    modele: string;
    annee: number;
    prix: number;
    kilometrage: number;
    carburant: 'essence' | 'diesel' | 'hybride' | 'electrique';
    boite_vitesse: 'manuelle' | 'automatique';
    couleur: string;
    puissance: number;
    nombre_portes: number;
    nombre_places: number;
    equipements: string[];
    etat: 'excellent' | 'bon' | 'moyen' | 'a_renover';
    localisation: string;
    disponibilite: 'disponible' | 'reserve' | 'vendu';
  };
  categories: number[];
  tags: number[];
  date: string;
  modified: string;
}

// Types pour les réponses API
export interface WordPressApiResponse<T> {
  data: T[];
  total: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
}

export interface WordPressApiError {
  code: string;
  message: string;
  data: {
    status: number;
    params: Record<string, any>;
    details: Record<string, any>;
  };
}

// Types pour les requêtes
export interface WordPressQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  order?: 'asc' | 'desc';
  orderby?: string;
  status?: string;
  categories?: string;
  tags?: string;
  author?: number;
  after?: string;
  before?: string;
  exclude?: string;
  include?: string;
  offset?: number;
  parent?: number;
  parent_exclude?: string;
  slug?: string;
  type?: string;
  format?: string;
  sticky?: boolean;
  featured_media?: number;
  meta_key?: string;
  meta_value?: string;
  meta_compare?: string;
  meta_type?: string;
  meta_query?: Array<{
    key: string;
    value: string;
    compare: string;
    type?: string;
  }>;
}
