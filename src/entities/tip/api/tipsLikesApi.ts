import { supabase } from '../../../shared/api/supabase'

export const getLikedTips = async (userId: string) => {
  const { data } = await supabase
    .from('tips_likes')
    .select('tip_id')
    .eq('user_id', userId)

  return data?.map((i) => i.tip_id) || []
}

export const toggleTipLike = async (
  userId: string,
  tipId: string
) => {

  const { data } = await supabase
    .from('tips_likes')
    .select('*')
    .eq('user_id', userId)
    .eq('tip_id', tipId)
    .maybeSingle()

  if (data) {
    await supabase
      .from('tips_likes')
      .delete()
      .eq('id', data.id)
  } else {
    await supabase
      .from('tips_likes')
      .insert({
        user_id: userId,
        tip_id: tipId
      })
  }
}