import { createClient } from './supabase';

// Load all user data from Supabase
export async function loadUserData(userId) {
    const supabase = createClient();
  
    const [profileRes, progressRes, notesRes, bookmarksRes, streakRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('progress').select('*').eq('user_id', userId),
      supabase.from('notes').select('*').eq('user_id', userId),
      supabase.from('bookmarks').select('*').eq('user_id', userId),
      supabase.from('streaks').select('*').eq('user_id', userId).single(),
    ]);
  
    console.log('profile:', profileRes.data, profileRes.error);
    console.log('progress:', progressRes.data, progressRes.error);
    console.log('notes:', notesRes.data, notesRes.error);
    console.log('bookmarks:', bookmarksRes.data, bookmarksRes.error);
    console.log('streaks:', streakRes.data, streakRes.error);
  
    const profile = profileRes.data;
    const progress = progressRes.data || [];
    const notes = notesRes.data || [];
    const bookmarks = bookmarksRes.data || [];
    const streak = streakRes.data;
  
    return {
      onboarded: profile ? !!profile.reading_path : false,
      userType: profile?.role || null,
      readingPath: profile?.reading_path || null,
      pace: profile?.pace || null,
      completedDays: progress.filter(p => p.completed).map(p => p.entry_id),
      unlockedDays: progress.filter(p => p.unlocked).map(p => p.entry_id),
      notes: Object.fromEntries(notes.map(n => [n.entry_id, n.note_text])),
      bookmarks: bookmarks.map(b => b.entry_id),
      streak: streak?.current_streak || 0,
      lastCompleted: streak?.last_completed_date || null,
    };
  }

// Save onboarding / profile data
export async function saveProfile(userId, email, { userType, readingPath, pace }) {
  const supabase = createClient();
  await supabase.from('profiles').upsert({
    id: userId,
    email,
    role: userType,
    reading_path: readingPath,
    pace,
  });
}

// Unlock a day
export async function unlockDay(userId, entryId) {
  const supabase = createClient();
  await supabase.from('progress').upsert({
    user_id: userId,
    entry_id: entryId,
    unlocked: true,
  }, { onConflict: 'user_id,entry_id' });
}

// Toggle day complete
export async function completeDay(userId, entryId, completed) {
  const supabase = createClient();
  await supabase.from('progress').upsert({
    user_id: userId,
    entry_id: entryId,
    completed,
    completed_at: completed ? new Date().toISOString() : null,
  }, { onConflict: 'user_id,entry_id' });
}

// Save streak
export async function saveStreak(userId, currentStreak, lastCompletedDate) {
  const supabase = createClient();
  const { data: existing } = await supabase
    .from('streaks')
    .select('longest_streak')
    .eq('user_id', userId)
    .single();

  await supabase.from('streaks').upsert({
    user_id: userId,
    current_streak: currentStreak,
    longest_streak: Math.max(currentStreak, existing?.longest_streak || 0),
    last_completed_date: lastCompletedDate,
  }, { onConflict: 'user_id' });
}

// Save a note
export async function saveNote(userId, entryId, text) {
  const supabase = createClient();
  if (text.trim()) {
    await supabase.from('notes').upsert({
      user_id: userId,
      entry_id: entryId,
      note_text: text,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,entry_id' });
  } else {
    await supabase.from('notes')
      .delete()
      .eq('user_id', userId)
      .eq('entry_id', entryId);
  }
}

// Toggle bookmark
export async function toggleBookmarkDB(userId, entryId, shouldBookmark) {
  const supabase = createClient();
  if (shouldBookmark) {
    await supabase.from('bookmarks').upsert({
      user_id: userId,
      entry_id: entryId,
      saved_at: new Date().toISOString(),
    }, { onConflict: 'user_id,entry_id' });
  } else {
    await supabase.from('bookmarks')
      .delete()
      .eq('user_id', userId)
      .eq('entry_id', entryId);
  }
}