import { supabase } from './supabase';

export const registerUser = async (
  email: string,
  password: string,
  name: string
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  if (data.user) {
    await supabase.from('profiles').insert({
      id: data.user.id,
      email,
      name,
    });
  }

  return data.user;
};

export const loginUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data.user;
};

export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};