import { supabase } from '../../../shared/api/supabase'
import type { Tip } from '../../tip'

export interface SavedTip extends Tip {
  saved_at: string;
  user_id: string;
}

export const toggleSaveTip = async (userId: string, tip: Tip): Promise<boolean> => {
  console.log('Toggle save for tip:', tip.id);
  
  try {
    // Проверяем, сохранен ли уже совет
    const { data: existing } = await supabase
      .from('saved_tips')
      .select('id')
      .eq('user_id', userId)
      .eq('tip_id', tip.id)
      .maybeSingle();

    if (existing) {
      // Удаляем
      console.log('Removing saved tip:', tip.id);
      const { error } = await supabase
        .from('saved_tips')
        .delete()
        .eq('id', existing.id);

      if (error) throw error;
      return false; // больше не сохранено
    } else {
      // Сохраняем
      console.log('Saving tip:', tip.id);
      const { error } = await supabase
        .from('saved_tips')
        .insert({
          user_id: userId,
          tip_id: tip.id,
          title: tip.title,
          content: tip.content,
          category: tip.category,
          saved_at: new Date().toISOString()
        });

      if (error) throw error;
      return true; // теперь сохранено
    }
  } catch (error) {
    console.error('Error toggling save:', error);
    throw error;
  }
};