export interface PostFormData {
    title: string;
    slug: string;
    imageUrl: string;
    createdBy: string;
    categoryIds: number[];
    content: string;
  }
  
  export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
  }