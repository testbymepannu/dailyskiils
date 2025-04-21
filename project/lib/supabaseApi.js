// Example: User sign up with email and password
import { supabase } from '../lib/supabase';

export async function signUpWithEmail(email, password) {
  const { user, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { user, error };
}

// Example: Fetch all jobs
export async function fetchJobs() {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
}

// Example: Insert a new job (for employers)
export async function createJob(job) {
  const { data, error } = await supabase
    .from('jobs')
    .insert([job]);
  return { data, error };
}

// Fetch all conversations for a user
export async function fetchConversations(userId) {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .contains('participants', [userId])
    .order('updated_at', { ascending: false });
  return { data, error };
}

// Fetch all messages for a conversation
export async function fetchMessages(conversationId) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  return { data, error };
}

// Send a new message
export async function sendMessage({ conversation_id, sender_id, content }) {
  const { data, error } = await supabase
    .from('messages')
    .insert([{ conversation_id, sender_id, content }]);
  return { data, error };
}
