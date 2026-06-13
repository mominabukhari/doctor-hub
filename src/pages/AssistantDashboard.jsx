// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { supabase } from '../utils/supabaseClient';
// import { GlassCard } from '../components/ui/GlassCard';
// import { Button } from '../components/ui/Button';
// import { PageTransition } from '../components/ui/PageTransition';
// import { LogOut, Activity, Check, X, ShieldAlert, Clock } from 'lucide-react';

// export default function AssistantDashboard() {
//   const { logout, profile } = useAuth();
//   const [pendingReviews, setPendingReviews] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchPendingPayments();
//   }, []);

//   const fetchPendingPayments = async () => {
//     try {
//       setLoading(true);
//       const { data, error } = await supabase
//         .from('payments')
//         .select(`
//           id, amount, receipt_url, status, appointment_id,
//           appointments ( 
//             id, appointment_date, disease_description
//           )
//         `)
//         .eq('status', 'pending'); 

//       if (error) throw error;
      
//       const filteredData = (data || []).filter(item => item.receipt_url && item.receipt_url !== "");
//       setPendingReviews(filteredData);
//     } catch (err) {
//       console.error('Error fetching payments:', err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyPayment = async (paymentId, appointmentId, isApproved) => {
//     if (!appointmentId) return alert("Appointment ID missing!");
//     setLoading(true);
//     try {
//       // 1. Payment Table: 'verified' value enum mein allow hai
//       const { error: payError } = await supabase
//         .from('payments')
//         .update({ status: isApproved ? 'verified' : 'failed' }) 
//         .eq('id', paymentId);
      
//       if (payError) throw payError;

//       // 2. Appointment Table: 'confirmed' value enum mein allow hai
//       const { error: apptError } = await supabase
//         .from('appointments')
//         .update({ status: isApproved ? 'confirmed' : 'pending' })
//         .eq('id', appointmentId);
        
//       if (apptError) throw apptError;

//       fetchPendingPayments();
//     } catch (err) {
//       console.error('Verification workflow error:', err.message);
//       alert("Database Error: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <PageTransition className="min-h-screen bg-slate-950 text-slate-100 pb-12">
//       <header className="border-b border-slate-900 bg-slate-900/40 backdrop-blur-md sticky top-0 z-40">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl"><Activity size={20} /></div>
//             <div>
//               <h1 className="text-md font-bold uppercase tracking-wider">Clinical Assistant Desk</h1>
//               <p className="text-xs text-slate-500 font-medium">Logged in: {profile?.full_name}</p>
//             </div>
//           </div>
//           <Button variant="danger" size="sm" onClick={logout} className="gap-2">
//             Logout <LogOut size={16} />
//           </Button>
//         </div>
//       </header>

//       <main className="max-w-4xl mx-auto px-4 sm:px-6 mt-10">
//         <GlassCard className="p-6" hoverEffect={false}>
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-lg font-bold text-slate-200">Under Review Financial Audits</h2>
//             <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-lg border border-blue-500/20 flex items-center gap-1">
//               <Clock size={12} /> {pendingReviews.length} Awaiting Actions
//             </span>
//           </div>

//           <div className="space-y-4">
//             {pendingReviews.length > 0 ? (
//               pendingReviews.map((item) => (
//                 <div key={item.id} className="p-5 bg-slate-950/70 border border-slate-900 rounded-xl grid md:grid-cols-3 gap-4 items-center">
//                   <div className="space-y-1">
//                     <h3 className="font-bold text-sm text-slate-200">Appointment ID: {item.appointment_id}</h3>
//                     <p className="text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded w-fit mt-1">Date: {item.appointments?.appointment_date || 'N/A'}</p>
//                   </div>

//                   <div className="space-y-1">
//                     <p className="text-xs font-semibold text-emerald-400">Amount: Rs. {item.amount}</p>
//                     <p className="text-xs text-slate-300">
//                       Receipt: <a href={item.receipt_url} target="_blank" rel="noreferrer" className="font-mono bg-slate-900 px-1.5 py-0.5 rounded text-teal-400 truncate block">View Receipt</a>
//                     </p>
//                   </div>

//                   <div className="flex gap-2 justify-end">
//                     <Button variant="danger" className="px-3 py-2 text-xs" onClick={() => handleVerifyPayment(item.id, item.appointment_id, false)} disabled={loading}>
//                       <X size={14} /> Reject
//                     </Button>
//                     <Button variant="primary" className="px-3 py-2 text-xs text-slate-950 bg-emerald-400 hover:bg-emerald-300" onClick={() => handleVerifyPayment(item.id, item.appointment_id, true)} disabled={loading}>
//                       <Check size={14} /> Approve
//                     </Button>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-16 text-slate-500 text-sm border border-dashed border-slate-900 rounded-xl">
//                 <ShieldAlert className="mx-auto text-slate-600 mb-2" size={32} />
//                 All clear! No payment requests under review right now.
//               </div>
//             )}
//           </div>
//         </GlassCard>
//       </main>
//     </PageTransition>
//   );
// }
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { PageTransition } from '../components/ui/PageTransition';
import { LogOut, Activity, Check, X, ShieldAlert, Clock } from 'lucide-react';

export default function AssistantDashboard() {
  const { logout, profile } = useAuth();
  const [pendingReviews, setPendingReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payments')
        .select(`
          id, amount, receipt_url, status, appointment_id,
          appointments ( 
            id, appointment_date, disease_description
          )
        `)
        .eq('status', 'pending'); 

      if (error) throw error;
      
      const filteredData = (data || []).filter(item => item.receipt_url && item.receipt_url !== "");
      setPendingReviews(filteredData);
    } catch (err) {
      console.error('Error fetching payments:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (paymentId, appointmentId, isApproved) => {
    if (!appointmentId) return alert("Appointment ID missing!");
    setLoading(true);
    try {
      const { error: payError } = await supabase
        .from('payments')
        .update({ status: isApproved ? 'verified' : 'failed' }) 
        .eq('id', paymentId);
      
      if (payError) throw payError;

      const { error: apptError } = await supabase
        .from('appointments')
        .update({ status: isApproved ? 'confirmed' : 'pending' })
        .eq('id', appointmentId);
        
      if (apptError) throw apptError;

      fetchPendingPayments();
    } catch (err) {
      console.error('Verification workflow error:', err.message);
      alert("Database Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition className="min-h-screen bg-slate-950 text-slate-100 pb-12">
      <header className="border-b border-slate-900 bg-slate-900/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl"><Activity size={20} /></div>
            <div>
              <h1 className="text-md font-bold uppercase tracking-wider">Clinical Assistant Desk</h1>
              <p className="text-xs text-slate-500 font-medium">Logged in: {profile?.full_name}</p>
            </div>
          </div>
          <Button variant="danger" size="sm" onClick={logout} className="gap-2">
            Logout <LogOut size={16} />
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 mt-10">
        <GlassCard className="p-6" hoverEffect={false}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-200">Under Review Financial Audits</h2>
            <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-lg border border-blue-500/20 flex items-center gap-1">
              <Clock size={12} /> {pendingReviews.length} Awaiting Actions
            </span>
          </div>

          <div className="space-y-4">
            {pendingReviews.length > 0 ? (
              pendingReviews.map((item) => (
                <div key={item.id} className="p-5 bg-slate-950/70 border border-slate-900 rounded-xl grid md:grid-cols-3 gap-4 items-center">
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-slate-200">Appointment ID: {item.appointment_id}</h3>
                    <p className="text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded w-fit mt-1">Date: {item.appointments?.appointment_date || 'N/A'}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-emerald-400">Amount: Rs. {item.amount}</p>
                    <p className="text-xs text-slate-300">
                      Receipt: <a href={item.receipt_url} target="_blank" rel="noreferrer" className="font-mono bg-slate-900 px-1.5 py-0.5 rounded text-teal-400 truncate block">View Receipt</a>
                    </p>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button variant="danger" className="px-3 py-2 text-xs" onClick={() => handleVerifyPayment(item.id, item.appointment_id, false)} disabled={loading}>
                      <X size={14} /> Reject
                    </Button>
                    <Button variant="primary" className="px-3 py-2 text-xs text-slate-950 bg-emerald-400 hover:bg-emerald-300" onClick={() => handleVerifyPayment(item.id, item.appointment_id, true)} disabled={loading}>
                      <Check size={14} /> Approve
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 text-slate-500 text-sm border border-dashed border-slate-900 rounded-xl">
                <ShieldAlert className="mx-auto text-slate-600 mb-2" size={32} />
                All clear! No payment requests under review right now.
              </div>
            )}
          </div>
        </GlassCard>
      </main>
    </PageTransition>
  );
}