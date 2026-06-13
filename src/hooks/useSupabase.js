import { useState, useCallback } from 'react';
import { supabase } from '../utils/supabaseClient';

export const useSupabase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (asyncFunc) => {
    setLoading(true);
    setError(null);
    try {
      const data = await asyncFunc();
      return data;
    } catch (err) {
      setError(err.message || 'Something went wrong');
      console.error('Supabase Hook Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, request };
};