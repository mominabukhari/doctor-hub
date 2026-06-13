// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { Mail, Lock, Activity } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import { PageTransition } from '../components/ui/PageTransition';
// import { GlassCard } from '../components/ui/GlassCard';
// import { Input } from '../components/ui/Input';
// import { Button } from '../components/ui/Button';
// import { AnimatedMascot } from '../components/ui/AnimatedMascot';

// export const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [focus, setFocus] = useState(null);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
  
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       setError('');
//       await login(email, password);
//       navigate('/dashboard'); // Route handler in App.jsx will decide exact dashboard
//     } catch (err) {
//       setError(err.message || 'Failed to login');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <PageTransition className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
//       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950 to-slate-950" />
      
//       <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center relative z-10">
//         {/* Left Side - Mascot */}
//         <div className="hidden md:block h-full">
//           <AnimatedMascot inputFocus={focus} />
//         </div>

//         {/* Right Side - Form */}
//         <GlassCard className="p-8 md:p-12 w-full max-w-md mx-auto">
//           <div className="mb-10 text-center">
//             <div className="flex justify-center mb-4">
//               <div className="p-3 bg-emerald-500/10 rounded-2xl">
//                 <Activity className="w-8 h-8 text-emerald-400" />
//               </div>
//             </div>
//             <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
//             <p className="text-slate-400">Secure access to your medical portal</p>
//           </div>

//           <form onSubmit={handleLogin} className="space-y-6">
//             <div className="space-y-4">
//               <Input
//                 icon={Mail}
//                 type="email"
//                 placeholder="Email Address"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 onFocus={() => setFocus('email')}
//                 onBlur={() => setFocus(null)}
//                 required
//               />
//               <Input
//                 icon={Lock}
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 onFocus={() => setFocus('password')}
//                 onBlur={() => setFocus(null)}
//                 required
//               />
//             </div>

//             {error && (
//               <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
//                 {error}
//               </div>
//             )}

//             <Button type="submit" className="w-full" isLoading={loading}>
//               Authenticate
//             </Button>
//           </form>

//           <div className="mt-8 text-center text-sm text-slate-400">
//             Don't have an account?{' '}
//             <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
//               Register now
//             </Link>
//           </div>
//         </GlassCard>
//       </div>
//     </PageTransition>
//   );
// };
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';
import { PageTransition } from '../components/ui/PageTransition';
import { AnimatedMascot } from '../components/ui/AnimatedMascot';
import { Mail, Lock, LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const authData = await login(email, password);
      
      // Fetch fresh profile metadata after login redirect guard
      const { data: profile } = await import('../utils/supabaseClient').then(m => 
        m.supabase.from('users').select('role').eq('id', authData.user.id).single()
      );

      if (profile?.role === 'patient') navigate('/patient');
      else if (profile?.role === 'doctor') navigate('/doctor');
      else if (profile?.role === 'assistant') navigate('/assistant');
      else if (profile?.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid email credentials or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-emerald-500/5 blur-[150px] -top-40 -left-40 pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] bg-teal-500/5 blur-[150px] -bottom-40 -right-40 pointer-events-none" />

      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center z-10">
        
        {/* Mascot Column */}
        <div className="hidden md:flex flex-col items-center justify-center text-center space-y-4">
          <AnimatedMascot />
          <div>
            <h3 className="text-xl font-bold text-slate-200">AI Medical Core Guard</h3>
            <p className="text-sm text-slate-500 max-w-xs mt-1">Watching over end-to-end encrypted medical workflows live.</p>
          </div>
        </div>

        {/* Login Card Form Column */}
        <GlassCard className="p-8 sm:p-10 relative">
          <div className="space-y-2 mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Welcome Back</h2>
            <p className="text-sm text-slate-400">Sign in to manage your medical operations pipeline.</p>
          </div>

          {error && (
            <div className="p-4 mb-6 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Secure Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" variant="primary" className="w-full py-3.5 mt-2" isLoading={loading}>
              Access Account <LogIn size={18} className="ml-1" />
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              Create an account
            </Link>
          </div>
        </GlassCard>
      </div>
    </PageTransition>
  );
}