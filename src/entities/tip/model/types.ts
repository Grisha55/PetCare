export interface Tip {
  id: string;
  title: string;
  description: string;
  category: 'health' | 'training' | 'nutrition';
  image: string;
}