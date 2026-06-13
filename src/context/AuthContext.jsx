// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { supabase } from '../utils/supabaseClient';

// const AuthContext = createContext({});

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Get active session
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setUser(session?.user ?? null);
//       if (session?.user) fetchProfile(session.user.id);
//       else setLoading(false);
//     });

//     // Listen for auth state changes
//     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
//       setUser(session?.user ?? null);
//       if (session?.user) {
//         fetchProfile(session.user.id);
//       } else {
//         setProfile(null);
//         setLoading(false);
//       }
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   const fetchProfile = async (userId) => {
//     try {
//       const { data, error } = await supabase
//         .from('users')
//         .select('*')
//         .eq('id', userId)
//         .single();

//       if (error) throw error;
//       setProfile(data);
//     } catch (err) {
//       console.error("Error fetching user profile:", err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (email, password) => {
//     const { data, error } = await supabase.auth.signInWithPassword({ email, password });
//     if (error) throw error;
//     return data;
//   };

//   const register = async (email, password, fullName, role) => {
//     // 1. Sign up user in Supabase Auth
//     const { data: authData, error: authError } = await supabase.auth.signUp({
//       email,
//       password,
//     });
    
//     if (authError) throw authError;

//     if (authData?.user) {
//       // 2. Insert custom profile data into users table
//       const { error: profileError } = await supabase
//         .from('users')
//         .insert([
//           { 
//             id: authData.user.id, 
//             full_name: fullName, 
//             email: email, 
//             role: role 
//           }
//         ]);

//       if (profileError) throw profileError;
      
//       // If patient, insert into patients table automatically
//       if (role === 'patient') {
//         await supabase.from('patients').insert([{ id: authData.user.id, name: fullName, email: email }]);
//       }
//     }
//     return authData;
//   };

//   const logout = async () => {
//     await supabase.auth.signOut();
//   };

//   return (
//     <AuthContext.Provider value={{ user, profile, loading, login, register, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error("Error fetching user profile:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const register = async (email, password, fullName, role) => {
    // 1. Sign up user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (authError) throw authError;

    if (authData?.user) {
      // 2. Insert custom profile data into users table
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          { 
            id: authData.user.id, 
            full_name: fullName, 
            email: email, 
            role: role 
          }
        ]);

      if (profileError) throw profileError;
      
      // Patient table insertion is now handled by the Database Trigger automatically.
    }
    return authData;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);