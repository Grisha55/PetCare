export interface Tip {
  id: string
  title: string
  content: string
  category: 'health' | 'training' | 'nutrition'
  link?: string
  liked?: boolean
}