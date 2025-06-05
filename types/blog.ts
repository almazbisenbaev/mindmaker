export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author_id: string;
  is_published: boolean;
  meta_title: string;
  meta_description: string;
  meta_keywords: string[];
  reading_time: number;
  tags: string[];
}

export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  created_at: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  created_at: string;
}
