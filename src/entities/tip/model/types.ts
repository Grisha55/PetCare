export type TipCategory = 'health' | 'training' | 'nutrition';

export interface Tip {
  id: string;
  title: string;
  content: string;
  category: 'health' | 'training' | 'nutrition';
  saved?: boolean; // добавляем поле saved
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