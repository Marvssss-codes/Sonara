// @ts-nocheck
import { supabase } from '@/lib/supabase';

export async function mirrorLikeToSupabase(track) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId || !track?.id) return;
    await supabase.from('favorites').upsert({
      user_id: userId,
      track_id: track.id,
      name: track.name,
      artists: track.artists?.map(a => a.name).join(', '),
      album: track.album?.name,
      image: track.album?.images?.[0]?.url || null,
      preview_url: track.preview_url || null,
      duration_ms: track.duration_ms || null,
    }, { onConflict: 'user_id,track_id' });
  } catch {}
}

export async function mirrorUnlikeFromSupabase(trackId) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId || !trackId) return;
    await supabase.from('favorites').delete().match({ user_id: userId, track_id: trackId });
  } catch {}
}


