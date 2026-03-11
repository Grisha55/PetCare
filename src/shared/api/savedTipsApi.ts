import { supabase } from './supabase';
import type { Tip } from '../../entities/tip';

export interface SavedTip extends Tip {
  saved_at: string;
  user_id: string;
}

export const saveTip = async (userId: string, tip: Tip): Promise<any> => {
  console.log('Saving tip for user:', userId);
  console.log('Tip to save:', tip);
  
  // Проверяем структуру таблицы - возможно поля называются иначе
  const { data, error } = await supabase
    .from('saved_tips')
    .insert({
      user_id: userId,
      tip_id: tip.id,        // может быть tipId или id
      title: tip.title,
      content: tip.content,
      category: tip.category,
      saved_at: new Date().toISOString() // может быть created_at или date
    })
    .select();

  if (error) {
    console.error('Error saving tip:', error);
    throw error;
  }
  
  console.log('Save response:', data);
  return data;
};

export const unsaveTip = async (userId: string, tipId: string): Promise<void> => {
  console.log('Attempting to delete tip:', tipId, 'for user:', userId);
  
  // Проверяем все записи пользователя
  const { data: allUserTips, error: fetchError } = await supabase
    .from('saved_tips')
    .select('*')
    .eq('user_id', userId);

  console.log('All tips for this user:', allUserTips, fetchError);
  
  // Ищем запись с нужным tip_id
  const matchingTip = allUserTips?.find(tip => tip.tip_id === tipId || tip.id === tipId);
  console.log('Matching tip found:', matchingTip);

  if (matchingTip) {
    // Удаляем по id записи, а не по tip_id
    const { data, error } = await supabase
      .from('saved_tips')
      .delete()
      .eq('id', matchingTip.id)
      .select();

    if (error) {
      console.error('Error unsaving tip:', error);
      throw error;
    }
    
    console.log('Delete response:', data);
    console.log('Tip unsaved successfully:', tipId);
  } else {
    console.log('No matching tip found in database');
  }
};

export const getSavedTips = async (userId: string): Promise<SavedTip[]> => {
  console.log('Fetching saved tips for user:', userId);
  
  const { data, error } = await supabase
    .from('saved_tips')
    .select('*')
    .eq('user_id', userId)
    .order('saved_at', { ascending: false });

  if (error) {
    console.error('Error fetching saved tips:', error);
    return [];
  }

  console.log('Fetched saved tips:', data);
  console.log('Number of saved tips:', data?.length || 0);
  
  // Преобразуем данные в нужный формат
  const formattedTips = (data || []).map(item => ({
    id: item.tip_id || item.id,  // используем tip_id как id
    title: item.title,
    content: item.content,
    category: item.category,
    saved_at: item.saved_at || item.created_at,
    user_id: item.user_id
  }));
  
  return formattedTips;
};

export const isTipSaved = async (userId: string, tipId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('saved_tips')
    .select('id')
    .eq('user_id', userId)
    .eq('tip_id', tipId);

  if (error) {
    console.error('Error checking saved tip:', error);
    return false;
  }

  return data && data.length > 0;
};

export const toggleSaveTip = async (userId: string, tip: Tip): Promise<boolean> => {
  const isSaved = await isTipSaved(userId, tip.id);
  console.log('Toggle save - is currently saved:', isSaved);
  
  if (isSaved) {
    await unsaveTip(userId, tip.id);
    return false;
  } else {
    await saveTip(userId, tip);
    return true;
  }
};