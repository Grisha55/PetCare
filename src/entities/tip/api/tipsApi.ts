export interface Tip {
  id: string
  title: string
  content: string
  category: 'health' | 'training' | 'nutrition'
}

interface DogFact {
  id: string
  attributes: {
    body: string
  }
}

interface DogApiResponse {
  data: DogFact[]
}

export const fetchTips = async (limit = 6): Promise<Tip[]> => {
  const res = await fetch(
    `https://dogapi.dog/api/v2/facts?limit=${limit}`
  )

  const json: DogApiResponse = await res.json()

  return json.data.map((item, index) => ({
    id: item.id,
    title: `Veterinary Tip`,
    content: item.attributes.body,
    category: ['health', 'training', 'nutrition'][index % 3] as
      | 'health'
      | 'training'
      | 'nutrition'
  }))
}