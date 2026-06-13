// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { supabase } from '../utils/supabaseClient';
// import { GlassCard } from '../components/ui/GlassCard';
// import { Button } from '../components/ui/Button';
// import { Modal } from '../components/ui/Modal';
// import { PageTransition } from '../components/ui/PageTransition';
// import { LogOut, Activity, FileText, ClipboardList, UserCheck } from 'lucide-react';

// export default function DoctorDashboard() {
//   const { user, logout, profile } = useAuth();
//   const [activeAppointments, setActiveAppointments] = useState([]);
//   const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
//   const [selectedAppt, setSelectedAppt] = useState(null);
//   const [prescriptionText, setPrescriptionText] = useState('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchDoctorQueue();
//   }, []);

//   const fetchDoctorQueue = async () => {
//     try {
//       // FIXED: 'CONFIRMED' -> 'confirmed' and 'date' -> 'appointment_date'
//       const { data, error } = await supabase
//         .from('appointments')
//         .select(`
//           id, appointment_date, status, disease_description,
//           patients ( id, name, email )
//         `)
//         .eq('doctor_id', user.id)
//         .eq('status', 'confirmed'); 

//       if (error) throw error;
//       setActiveAppointments(data || []);
//     } catch (err) {
//       console.error('Error fetching doctor queue:', err.message);
//     }
//   };

//   const handlePrescriptionSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const { error: medError } = await supabase
//         .from('medical_history')
//         .insert([
//           {
//             patient_id: selectedAppt.patients.id,
//             doctor_id: user.id,
//             diagnosis: selectedAppt.disease_description,
//             treatment_notes: prescriptionText
//           }
//         ]);
//       if (medError) throw medError;

//       // FIXED: status 'COMPLETED' -> 'completed'
//       const { error: apptError } = await supabase
//         .from('appointments')
//         .update({ status: 'completed' })
//         .eq('id', selectedAppt.id);
//       if (apptError) throw apptError;

//       setIsPrescriptionModalOpen(false);
//       setPrescriptionText('');
//       fetchDoctorQueue();
//     } catch (err) {
//       console.error('Prescription processing logging failed:', err.message);
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
//               <h1 className="text-md font-bold uppercase tracking-wider">Doctor Treatment Console</h1>
//               <p className="text-xs text-slate-500 font-medium">Dr. {profile?.full_name}</p>
//             </div>
//           </div>
//           <Button variant="danger" size="sm" onClick={logout} className="gap-2">
//             Logout <LogOut size={16} />
//           </Button>
//         </div>
//       </header>

//       <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-10">
//         <GlassCard className="p-6" hoverEffect={false}>
//           <h2 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
//             <ClipboardList className="text-emerald-400" /> Active Confirmed Patient Queue
//           </h2>

//           <div className="grid md:grid-cols-2 gap-4">
//             {activeAppointments.length > 0 ? (
//               activeAppointments.map((appt) => (
//                 <GlassCard key={appt.id} className="p-5 bg-slate-950/50 border border-slate-900 flex flex-col justify-between space-y-4">
//                   <div className="space-y-2">
//                     <div className="flex justify-between items-center">
//                       <span className="text-xs text-slate-500 font-mono">ID: #{appt.id.slice(0, 8)}</span>
//                       <span className="px-2 py-0.5 text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-bold uppercase tracking-wider">
//                         {appt.status}
//                       </span>
//                     </div>
//                     <h3 className="font-bold text-base text-slate-200">{appt.patients?.name}</h3>
//                     <p className="text-xs text-slate-400">Reported Symptoms: <span className="italic text-slate-300">"{appt.disease_description}"</span></p>
//                     <p className="text-[11px] text-slate-500">Scheduled Date: {appt.appointment_date}</p>
//                   </div>

//                   <Button 
//                     variant="primary" 
//                     className="w-full text-xs gap-1.5"
//                     onClick={() => {
//                       setSelectedAppt(appt);
//                       setIsPrescriptionModalOpen(true);
//                     }}
//                   >
//                     <FileText size={14} /> Write Digital Prescription
//                   </Button>
//                 </GlassCard>
//               ))
//             ) : (
//               <div className="col-span-2 text-center py-16 text-slate-500 text-sm border border-dashed border-slate-900 rounded-xl">
//                 <UserCheck className="mx-auto text-slate-600 mb-2" size={32} />
//                 No patients currently waiting in your treatment workspace queue.
//               </div>
//             )}
//           </div>
//         </GlassCard>
//       </main>

//       <Modal
//         isOpen={isPrescriptionModalOpen}
//         onClose={() => setIsPrescriptionModalOpen(false)}
//         title={`Prescription Management: ${selectedAppt?.patients?.name}`}
//       >
//         <form onSubmit={handlePrescriptionSubmit} className="space-y-4">
//           <div className="flex flex-col gap-2">
//             <label className="text-sm font-medium text-slate-300">Diagnosis Notes & Medical Prescription</label>
//             <textarea
//               required
//               className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-3.5 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 h-40"
//               placeholder="List down active medicines, doses formulas, clinic routines, or follow-up timelines..."
//               value={prescriptionText}
//               onChange={(e) => setPrescriptionText(e.target.value)}
//             />
//           </div>
//           <div className="flex justify-end gap-2 pt-2">
//             <Button variant="secondary" onClick={() => setIsPrescriptionModalOpen(false)}>Close</Button>
//             <Button type="submit" variant="primary" isLoading={loading}>Seal & Log Prescription</Button>
//           </div>
//         </form>
//       </Modal>
//     </PageTransition>
//   );
// }
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { PageTransition } from '../components/ui/PageTransition';
import { LogOut, Activity, FileText, ClipboardList, UserCheck, X } from 'lucide-react';

export default function DoctorDashboard() {
  const { user, logout, profile } = useAuth();
  const [activeAppointments, setActiveAppointments] = useState([]);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [prescriptionText, setPrescriptionText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDoctorQueue();
  }, []);

  const fetchDoctorQueue = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id, appointment_date, status, disease_description,
          patients ( id, contact_number )
        `)
        .eq('doctor_id', user.id)
        .eq('status', 'confirmed'); 

      if (error) throw error;
      setActiveAppointments(data || []);
    } catch (err) {
      console.error('Error fetching doctor queue:', err.message);
    }
  };

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAppt) return;
    setLoading(true);
    try {
      // Yahan 'treatment_notes' ko 'notes' se replace kar diya gaya hai
      const { error: medError } = await supabase
        .from('medical_history')
        .insert([{
            patient_id: selectedAppt.patients.id,
            doctor_id: user.id,
            appointment_id: selectedAppt.id,
            diagnosis: selectedAppt.disease_description,
            notes: prescriptionText 
        }]);
      if (medError) throw medError;

      const { error: apptError } = await supabase
        .from('appointments')
        .update({ status: 'completed' })
        .eq('id', selectedAppt.id);
      if (apptError) throw apptError;

      setIsPrescriptionModalOpen(false);
      setPrescriptionText('');
      fetchDoctorQueue();
    } catch (err) {
      console.error('Prescription error:', err.message);
      alert("Error: " + err.message);
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
              <h1 className="text-md font-bold uppercase tracking-wider">Doctor Treatment Console</h1>
              <p className="text-xs text-slate-500 font-medium">Dr. {profile?.full_name}</p>
            </div>
          </div>
          <Button variant="danger" size="sm" onClick={logout} className="gap-2">
            Logout <LogOut size={16} />
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-10">
        <GlassCard className="p-6">
          <h2 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
            <ClipboardList className="text-emerald-400" /> Active Confirmed Patient Queue
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {activeAppointments.length > 0 ? (
              activeAppointments.map((appt) => (
                <GlassCard key={appt.id} className="p-5 bg-slate-950/50 border border-slate-900">
                  <div className="space-y-2">
                    <h3 className="font-bold text-base text-slate-200">Patient #: {appt.patients?.contact_number}</h3>
                    <p className="text-xs text-slate-400">Symptoms: {appt.disease_description}</p>
                  </div>
                  <Button variant="primary" className="w-full mt-4 text-xs" onClick={() => { setSelectedAppt(appt); setIsPrescriptionModalOpen(true); }}>
                    <FileText size={14} /> Write Prescription
                  </Button>
                </GlassCard>
              ))
            ) : (
              <div className="col-span-2 text-center py-16 text-slate-500">
                <UserCheck className="mx-auto mb-2" size={32} />
                No patients in queue.
              </div>
            )}
          </div>
        </GlassCard>
      </main>

      <Modal isOpen={isPrescriptionModalOpen} onClose={() => setIsPrescriptionModalOpen(false)} title="Write Prescription">
        <form onSubmit={handlePrescriptionSubmit} className="space-y-4">
          <textarea 
            className="w-full h-32 p-3 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200"
            placeholder="Enter diagnosis and medicine..."
            value={prescriptionText}
            onChange={(e) => setPrescriptionText(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Seal & Log Record"}
          </Button>
        </form>
      </Modal>
    </PageTransition>
  );
}