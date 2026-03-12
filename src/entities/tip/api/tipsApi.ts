import type { Tip } from '../model/types'

interface DogFact {
  id: string;
  attributes: {
    body: string;
  };
}

interface DogApiResponse {
  data: DogFact[];
}

export const fetchTips = async (limit = 6): Promise<Tip[]> => {
  console.log(`🌐 Fetching tips with limit: ${limit}`);
  
  const res = await fetch(
    `https://dogapi.dog/api/v2/facts?limit=${limit}`
  );

  const json: DogApiResponse = await res.json();
  console.log(`🌐 Received ${json.data.length} facts from API`);

  const healthTitles = [
    "🏥 Здоровье питомца",
    "🩺 Советы ветеринара",
    "💊 Профилактика болезней",
    "❤️ Как сохранить здоровье",
    "🦷 Уход за зубами",
    "🐾 Прививки для собак"
  ];

  const trainingTitles = [
    "🎯 Дрессировка щенка",
    "🐕 Основные команды",
    "🎮 Игры с собакой",
    "🏃 Прогулки и активность",
    "🧠 Интеллектуальные игры",
    "👨‍🏫 Воспитание питомца"
  ];

  const nutritionTitles = [
    "🥩 Правильное питание",
    "🥗 Рацион для собак",
    "🍖 Натуральный корм",
    "🥫 Выбор сухого корма",
    "🍎 Витамины и добавки",
    "💧 Питьевой режим"
  ];

  return json.data.map((item, index) => {
    const category = ['health', 'training', 'nutrition'][index % 3] as 'health' | 'training' | 'nutrition';
    
    let title;
    if (category === 'health') {
      title = healthTitles[index % healthTitles.length];
    } else if (category === 'training') {
      title = trainingTitles[index % trainingTitles.length];
    } else {
      title = nutritionTitles[index % nutritionTitles.length];
    }

    return {
      id: item.id,
      title: title,
      content: item.attributes.body,
      category: category
    };
  });
};