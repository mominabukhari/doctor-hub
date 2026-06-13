// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { Mail, Lock, User, Activity } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import { PageTransition } from '../components/ui/PageTransition';
// import { GlassCard } from '../components/ui/GlassCard';
// import { Input } from '../components/ui/Input';
// import { Button } from '../components/ui/Button';
// import { AnimatedMascot } from '../components/ui/AnimatedMascot';

// export const Register = () => {
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//     role: 'patient'
//   });
//   const [focus, setFocus] = useState(null);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
  
//   const { register } = useAuth();
//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       setError('');
//       await register(formData.email, formData.password, formData.fullName, formData.role);
//       navigate('/dashboard');
//     } catch (err) {
//       setError(err.message || 'Failed to register');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <PageTransition className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
//       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-teal-900/20 via-slate-950 to-slate-950" />
      
//       <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center relative z-10">
//         {/* Left Side - Form */}
//         <GlassCard className="p-8 md:p-12 w-full max-w-md mx-auto md:order-1 order-2">
//           <div className="mb-8 text-center">
//             <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
//             <p className="text-slate-400">Join the next-gen healthcare portal</p>
//           </div>

//           <form onSubmit={handleRegister} className="space-y-5">
//             <div className="space-y-4">
//               <Input
//                 icon={User}
//                 type="text"
//                 placeholder="Full Name"
//                 value={formData.fullName}
//                 onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
//                 onFocus={() => setFocus('name')}
//                 onBlur={() => setFocus(null)}
//                 required
//               />
//               <Input
//                 icon={Mail}
//                 type="email"
//                 placeholder="Email Address"
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                 onFocus={() => setFocus('email')}
//                 onBlur={() => setFocus(null)}
//                 required
//               />
//               <Input
//                 icon={Lock}
//                 type="password"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                 onFocus={() => setFocus('password')}
//                 onBlur={() => setFocus(null)}
//                 required
//               />
              
//               <div className="space-y-1">
//                 <label className="text-sm font-medium text-slate-300 ml-1">Account Type</label>
//                 <select 
//                   className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all appearance-none"
//                   value={formData.role}
//                   onChange={(e) => setFormData({ ...formData, role: e.target.value })}
//                   onFocus={() => setFocus('role')}
//                   onBlur={() => setFocus(null)}
//                 >
//                   <option value="patient">Patient</option>
//                   <option value="doctor">Doctor</option>
//                   <option value="assistant">Assistant</option>
//                 </select>
//               </div>
//             </div>

//             {error && (
//               <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
//                 {error}
//               </div>
//             )}

//             <Button type="submit" className="w-full mt-2" isLoading={loading}>
//               Initialize Profile
//             </Button>
//           </form>

//           <div className="mt-8 text-center text-sm text-slate-400">
//             Already registered?{' '}
//             <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
//               Login here
//             </Link>
//           </div>
//         </GlassCard>

//         {/* Right Side - Mascot */}
//         <div className="hidden md:block h-full md:order-2 order-1">
//           <AnimatedMascot inputFocus={focus} />
//         </div>
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
import { User, Mail, Lock, UserPlus, CheckCircle } from 'lucide-react';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(email, password, fullName, role);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3500);
    } catch (err) {
      setError(err.message || 'Error occurred during registration processing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-emerald-500/5 blur-[150px] -bottom-40 -left-40 pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] bg-teal-500/5 blur-[150px] -top-40 -right-40 pointer-events-none" />

      <div className="w-full max-w-xl z-10">
        <GlassCard className="p-8 sm:p-10">
          <div className="space-y-2 mb-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Create Account</h2>
            <p className="text-sm text-slate-400">Join Doctor Hub ecosystem to handle clinical operations.</p>
          </div>

          {error && (
            <div className="p-4 mb-6 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="p-4 mb-6 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <CheckCircle size={16} /> Account created! Redirecting to setup terminal view...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Profile Name"
              type="text"
              icon={User}
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <Input
              label="Email Workspace"
              type="email"
              icon={Mail}
              placeholder="name@workspace.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Account Password"
              type="password"
              icon={Lock}
              placeholder="•••••••• (Min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Premium Custom Select Dropdown Block */}
            <div className="w-full flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Account System Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3.5 text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300"
              >
                <option value="patient" className="bg-slate-900">Patient Portal Account</option>
                <option value="doctor" className="bg-slate-900">Professional Doctor Account</option>
                <option value="assistant" className="bg-slate-900">Clinical Desk Assistant Account</option>
                <option value="admin" className="bg-slate-900">System Administrator Account</option>
              </select>
            </div>

            <Button type="submit" variant="primary" className="w-full py-3.5 mt-4" isLoading={loading} disabled={success}>
              Register Profile <UserPlus size={18} className="ml-1" />
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Already registered?{' '}
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              Sign In Here
            </Link>
          </div>
        </GlassCard>
      </div>
    </PageTransition>
  );
}