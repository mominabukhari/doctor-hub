import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { PageTransition } from '../components/ui/PageTransition';
import { Users, UserPlus, Activity, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [registeredDoctors, setRegisteredDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Form States
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [streamCategory, setStreamCategory] = useState('Allopathic');
  const [specialization, setSpecialization] = useState('');
  const [fee, setFee] = useState('');
  const [experience, setExperience] = useState('');

  useEffect(() => {
    fetchRegisteredDoctors();
  }, []);

  const fetchRegisteredDoctors = async () => {
    try {
      setLoading(true);
      
      // 1. 'users' table se saare records bina kisi strict clause ke fetch karna
      const { data: usersData, error: usersError } = await supabase
        .from('users') 
        .select('id, full_name, role');

      if (usersError) throw usersError;

      if (usersData && usersData.length > 0) {
        // FOOLPROOF FILTER: Custom user_role enum aur security checks bypass karne ke liye generic string casting
        const availableAccounts = usersData.filter(user => {
          const roleStr = user.role ? String(user.role).trim().toLowerCase() : '';
          const nameStr = user.full_name ? String(user.full_name).toLowerCase() : '';
          
          // Agar database roles custom object ya explicit string hain, dono scenarios handle ho jayenge
          const isDoctor = roleStr === 'doctor' || roleStr.includes('doc');
          const isAdmin = nameStr.includes('admin') || roleStr.includes('admin');
          
          return isDoctor && !isAdmin;
        });

        setRegisteredDoctors(availableAccounts);
      } else {
        setRegisteredDoctors([]);
      }

    } catch (err) {
      console.error("Database Connection Fetch Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMapProfile = async (e) => {
    e.preventDefault();
    if (!selectedDoctorId) {
      setMessage({ text: 'Please choose a valid doctor account from the directory.', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      // ON CONFLICT DO UPDATE (upsert): Agar profile entry table mein pehle se ho to data query update kar dega
      const { error } = await supabase
        .from('doctors')
        .upsert([
          {
            id: selectedDoctorId,
            treatment_type: streamCategory,
            specialization: specialization,
            experience_years: parseInt(experience, 10),
            consultation_fee: parseFloat(fee),
            is_available: true
          }
        ], { onConflict: 'id' });

      if (error) throw error;

      setMessage({ text: 'Doctor profile successfully configured/updated in the system.', type: 'success' });
      
      // Fields reset karna
      setSelectedDoctorId('');
      setSpecialization('');
      setFee('');
      setExperience('');
      
      fetchRegisteredDoctors();
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition className="min-h-screen bg-[#020617] text-slate-100 font-sans pb-12">
      <header className="border-b border-slate-900 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl"><Activity size={20} /></div>
          <div>
            <h1 className="text-base font-bold uppercase tracking-wider text-white">Root Administrator Console</h1>
            <p className="text-xs text-slate-400">System Directory Control Grid</p>
          </div>
        </div>
        <button onClick={logout} className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all">
          Logout <LogOut size={14} />
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-10 grid lg:grid-cols-3 gap-8">
        
        {/* Left Side Status Column */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 text-left h-fit">
          <div className="flex items-center gap-2 mb-4 text-emerald-400 font-bold text-sm uppercase tracking-wider">
            <Users size={16} /> Registered Doctors
          </div>
          
          {loading ? (
            <p className="text-xs text-slate-500 animate-pulse">Scanning database nodes...</p>
          ) : registeredDoctors.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 mb-2">Available doctor accounts ({registeredDoctors.length}):</p>
              {registeredDoctors.map(doc => (
                <div key={doc.id} className="p-3 bg-slate-950/60 border border-slate-900 rounded-xl flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-slate-200">{doc.full_name || 'Unnamed User'}</span>
                  <span className="text-[10px] text-emerald-400 capitalize">Role: {String(doc.role)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-500 py-6 bg-slate-950/30 border border-dashed border-slate-800 rounded-xl text-center px-4 leading-relaxed">
              No doctor accounts found in the system.
            </div>
          )}
        </div>

        {/* Right Side Form Input Desk */}
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 text-left">
          <div className="flex items-center gap-2 mb-6 text-emerald-400 font-bold text-sm uppercase tracking-wider">
            <UserPlus size={18} /> Onboard Doctor Medical Specialization Profile
          </div>

          {message.text && (
            <div className={`p-4 mb-4 text-xs rounded-xl border ${
              message.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleMapProfile} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Doctor Profile Account</label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  required
                >
                  <option value="">-- Choose User Profile --</option>
                  {registeredDoctors.map(doc => (
                    <option key={doc.id} value={doc.id}>
                      {doc.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Medical Stream Category</label>
                <select
                  value={streamCategory}
                  onChange={(e) => setStreamCategory(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Allopathic">Allopathic Track</option>
                  <option value="Homeopathic">Homeopathic Track</option>
                  <option value="Herbal">Herbal Track</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Disease Core Specialization Focus</label>
                <input
                  type="text"
                  placeholder="e.g., Cardiology, Dermatology"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Experience Years</label>
                <input
                  type="number"
                  placeholder="e.g., 5"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Consultation Checkup Fee (PKR)</label>
              <input
                type="number"
                placeholder="e.g., 2500"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl shadow-lg transition-all disabled:opacity-50"
            >
              Map Profile Setup
            </button>
          </form>
        </div>
      </main>
    </PageTransition>
  );
}