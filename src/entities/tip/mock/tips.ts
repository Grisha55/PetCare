import { Tip } from '../model/types';

export const tipsMock: Tip[] = [
  {
    id: '1',
    title: 'Как ухаживать за шерстью',
    description: 'Регулярное расчесывание помогает избежать колтунов...',
    category: 'health',
    image: '/images/tip1.jpg',
  },
  {
    id: '2',
    title: 'Дрессировка щенка',
    description: 'Начинайте обучение с базовых команд...',
    category: 'training',
    image: '/images/tip2.jpg',
  },
  {
    id: '3',
    title: 'Правильное питание',
    description: 'Выбирайте корм по возрасту и породе...',
    category: 'nutrition',
    image: '/images/tip3.jpg',
  },
];