export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface PortfolioItem {
  id: string;
  imageUrl: string;
  title: string;
  description?: string;
}

export interface Professional {
  id: string;
  name: string;
  title: string;
  avatar: string;
  coverImage: string;
  bio: string;
  category: Category;
  skills: string[];
  interests: string[];
  location: string;
  ethnicity: string;
  age: number;
  bodyType: string;
  rating: number;
  reviewCount: number;
  yearsExperience: number;
  services: Service[];
  portfolio: PortfolioItem[];
  reviews: Review[];
  availability: string;
  languages: string[];
  verified: boolean;
  isOnline: boolean;
  isLive: boolean;
}

export type Category = 
  | "companions"
  | "escorts"
  | "content-creators"
  | "entertainers"
  | "wellness"
  | "virtual";

export interface CategoryInfo {
  id: Category;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface FilterOptions {
  category?: Category;
  skills?: string[];
  location?: string;
  ethnicity?: string;
  minRating?: number;
  maxPrice?: number;
  minPrice?: number;
  searchQuery?: string;
}
