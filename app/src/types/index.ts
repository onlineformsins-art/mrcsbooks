export interface Book {
  id: string;
  title: string;
  titleEn: string;
  subtitle: string;
  author: string;
  price: number;
  category: 'tamil' | 'english' | 'sinhala';
  description: string;
  image: string;
  isNew?: boolean;
}

export interface CartItem extends Book {
  quantity: number;
}

export type View = 'home' | 'category' | 'bookDetail' | 'cart';
export type Language = 'tamil' | 'english' | 'sinhala' | 'all';
