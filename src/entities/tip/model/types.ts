export type TipCategory = 'health' | 'training' | 'nutrition';

export interface Tip {
  id: string;
  title: string;
  content: string;
  category: TipCategory;
  link?: string;
  liked?: boolean;
}

export interface DogFact {
  id: string;
  attributes: {
    body: string;
  };
}

export interface DogApiResponse {
  data: DogFact[];
}