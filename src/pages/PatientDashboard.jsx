// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { supabase } from '../utils/supabaseClient';
// import { GlassCard } from '../components/ui/GlassCard';
// import { Button } from '../components/ui/Button';
// import { Input } from '../components/ui/Input';
// import { Modal } from '../components/ui/Modal';
// import { PageTransition } from '../components/ui/PageTransition';
// import { 
//   LogOut, Activity, Search, Calendar, Clock, CreditCard 
// } from 'lucide-react';

// export default function PatientDashboard() {
//   const { user, profile, logout } = useAuth();
//   const [appointments, setAppointments] = useState([]);
//   const [doctors, setDoctors] = useState([]);
//   const [filteredDoctors, setFilteredDoctors] = useState([]);
  
//   const [searchDisease, setSearchDisease] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('All');
  
//   const [isBookModalOpen, setIsBookModalOpen] = useState(false);
//   const [selectedDoctor, setSelectedDoctor] = useState(null);
//   const [appointmentDate, setAppointmentDate] = useState('');
//   const [diseaseDescription, setDiseaseDescription] = useState('');
  
//   const [isPayModalOpen, setIsPayModalOpen] = useState(false);
//   const [selectedAppointment, setSelectedAppointment] = useState(null);
//   const [transactionCode, setTransactionCode] = useState('');
  
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     if (user || profile) {
//       fetchPatientData();
//       fetchDoctors();
//     }
//   }, [user, profile]);

//   useEffect(() => {
//     let result = doctors;
//     if (selectedCategory !== 'All') {
//       result = result.filter(doc => doc.treatment_type?.toLowerCase() === selectedCategory.toLowerCase());
//     }
//     if (searchDisease.trim() !== '') {
//       result = result.filter(doc => {
//         const specializationMatch = doc.specialization?.toLowerCase().includes(searchDisease.toLowerCase());
//         const nameMatch = doc.full_name?.toLowerCase().includes(searchDisease.toLowerCase());
//         return specializationMatch || nameMatch;
//       });
//     }
//     setFilteredDoctors(result);
//   }, [searchDisease, selectedCategory, doctors]);

//   const fetchPatientData = async () => {
//     try {
//       const targetPatientId = profile?.id || user?.id;
//       if (!targetPatientId) return;

//       const { data, error } = await supabase
//         .from('appointments')
//         .select(`
//           id, 
//           appointment_date, 
//           status, 
//           disease_description,
//           doctors ( treatment_type, consultation_fee, users ( full_name ) ),
//           payments ( id, receipt_url, amount, status )
//         `)
//         .eq('patient_id', targetPatientId)
//         .order('created_at', { ascending: false });

//       if (error) throw error;

//       const formattedAppts = data?.map(appt => {
//         const dbStatus = appt.status ? String(appt.status).toLowerCase() : 'pending';
        
//         const paymentsArray = Array.isArray(appt.payments) ? appt.payments : (appt.payments ? [appt.payments] : []);
//         const payment = paymentsArray.length > 0 ? paymentsArray[0] : null;
//         const hasReceipt = payment && payment.receipt_url && payment.receipt_url.trim() !== '';
        
//         let displayStatus = dbStatus;
//         if (dbStatus === 'pending' && hasReceipt) {
//           displayStatus = 'under_review';
//         }

//         return {
//           ...appt,
//           date: appt.appointment_date, 
//           disease_details: appt.disease_description,
//           raw_status: displayStatus, 
//           doctors: appt.doctors ? {
//             ...appt.doctors,
//             fee: appt.doctors.consultation_fee,
//             full_name: appt.doctors.users?.full_name || 'Medical Officer'
//           } : null
//         };
//       }) || [];

//       setAppointments(formattedAppts);
//     } catch (err) {
//       console.error("Fetch Patient Data Error: ", err.message);
//     }
//   };

//   const fetchDoctors = async () => {
//     try {
//       setLoading(true);
//       const { data, error } = await supabase
//         .from('doctors')
//         .select(`
//           id, 
//           treatment_type, 
//           specialization, 
//           consultation_fee, 
//           experience_years,
//           is_available,
//           users ( full_name )
//         `);
      
//       if (error) throw error;
      
//       if (data && data.length > 0) {
//         const UIFormattedDoctors = data.map(doc => ({
//           id: doc.id,
//           full_name: doc.users?.full_name || 'Registered Doctor Account',
//           treatment_type: doc.treatment_type || 'General',
//           specialization: doc.specialization || 'Clinical Practitioner',
//           fee: doc.consultation_fee || 1500,
//           availability: doc.is_available ? 'Active Profile' : 'Not Available'
//         }));

//         setDoctors(UIFormattedDoctors);
//         setFilteredDoctors(UIFormattedDoctors);
//       } else {
//         setDoctors([]);
//         setFilteredDoctors([]);
//       }
//     } catch (err) {
//       console.error("Patient Panel Resource Map Error: ", err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBookAppointment = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const actualPatientId = profile?.id || user?.id;
//       if (!actualPatientId) {
//         throw new Error("User session token or profile record not discovered.");
//       }

//       const { data: apptData, error: apptError } = await supabase
//         .from('appointments')
//         .insert([
//           {
//             patient_id: actualPatientId,
//             doctor_id: selectedDoctor.id,
//             appointment_date: appointmentDate,
//             appointment_time: '10:00:00', 
//             disease_description: diseaseDescription,
//             status: 'pending' 
//           }
//         ])
//         .select();

//       if (apptError) throw apptError;
      
//       if (apptData && apptData[0]) {
//         const { error: payError } = await supabase
//           .from('payments')
//           .insert([
//             {
//               appointment_id: apptData[0].id,
//               amount: selectedDoctor.fee,
//               status: 'pending',
//               receipt_url: ''
//             }
//           ]);
//         if (payError) console.error("Initial Payment Record Error:", payError);
//       }

//       setIsBookModalOpen(false);
//       setAppointmentDate('');
//       setDiseaseDescription('');
//       setMessage('Appointment requested successfully! Please complete payment.');
      
//       await fetchPatientData();
//     } catch (err) {
//       alert(`Booking Sync Issue: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePaymentSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       setMessage('');

//       const { data: checkPay } = await supabase
//         .from('payments')
//         .select('id')
//         .eq('appointment_id', selectedAppointment.id);

//       if (checkPay && checkPay.length === 0) {
//         await supabase.from('payments').insert([
//           { 
//             appointment_id: selectedAppointment.id, 
//             amount: selectedAppointment.doctors?.fee || 1500, 
//             receipt_url: transactionCode, 
//             status: 'pending' 
//           }
//         ]);
//       } else {
//         await supabase
//           .from('payments')
//           .update({ receipt_url: transactionCode, status: 'pending' })
//           .eq('appointment_id', selectedAppointment.id);
//       }

//       await supabase
//         .from('appointments')
//         .update({ status: 'pending' }) 
//         .eq('id', selectedAppointment.id);

//       setIsPayModalOpen(false);
//       setTransactionCode('');
//       setMessage('Payment proof submitted successfully! Review pending.');
      
//       await fetchPatientData();
      
//     } catch (err) {
//       console.error("Detailed Trace:", err);
//       alert(`Payment submission database error: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <PageTransition className="min-h-screen bg-[#020617] text-slate-100 font-sans pb-12">
//       <header className="border-b border-slate-900 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex justify-between items-center">
//         <div className="flex items-center gap-3">
//           <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl"><Activity size={20} /></div>
//           <div>
//             <h1 className="text-base font-bold uppercase tracking-wider text-white">Patient Portal Desk</h1>
//             <p className="text-xs text-slate-400">Welcome back, {profile?.full_name || 'Patient'}</p>
//           </div>
//         </div>
//         <Button variant="danger" size="sm" onClick={logout} className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2">
//           Logout <LogOut size={14} />
//         </Button>
//       </header>

//       <main className="max-w-7xl mx-auto px-6 mt-8 grid lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-2 space-y-6">
//           <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
//             <h2 className="text-lg font-bold text-slate-200 text-left">Find Healthcare Specialists</h2>
            
//             <div className="relative w-full">
//               <input 
//                 type="text"
//                 placeholder="Search by Disease focus or Doctor Name..."
//                 value={searchDisease}
//                 onChange={(e) => setSearchDisease(e.target.value)}
//                 className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
//               />
//             </div>

//             <div className="flex flex-wrap gap-2 pt-2">
//               {['All', 'Allopathic', 'Homeopathic', 'Herbal'].map((cat) => (
//                 <button
//                   key={cat}
//                   type="button"
//                   onClick={() => setSelectedCategory(cat)}
//                   className={`px-4 py-2 text-xs font-semibold tracking-wide rounded-xl transition-all duration-200 ${
//                     selectedCategory === cat 
//                       ? 'bg-emerald-500 text-slate-950 shadow-md font-bold' 
//                       : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
//                   }`}
//                 >
//                   {cat} Track
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="grid sm:grid-cols-2 gap-4">
//             {loading && doctors.length === 0 ? (
//               <div className="col-span-2 text-center py-12 text-slate-400 text-sm animate-pulse">
//                 Fetching configuration profiles from cloud server nodes...
//               </div>
//             ) : filteredDoctors.length > 0 ? (
//               filteredDoctors.map((doc) => (
//                 <div key={doc.id} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 text-left">
//                   <div className="space-y-2">
//                     <div className="flex justify-between items-start">
//                       <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded-md border border-emerald-500/20">
//                         {doc.treatment_type} Track
//                       </span>
//                       <span className="text-sm font-bold text-emerald-400">Rs. {doc.fee}</span>
//                     </div>
//                     <h3 className="font-bold text-base text-white">{doc.full_name.startsWith('Dr.') ? doc.full_name : `Dr. ${doc.full_name}`}</h3>
//                     <p className="text-xs text-slate-400">Specialization: {doc.specialization}</p>
//                     <p className="text-[11px] text-slate-500">Status: {doc.availability}</p>
//                   </div>
                  
//                   <button 
//                     type="button"
//                     className="w-full text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl transition-all"
//                     onClick={() => {
//                       setSelectedDoctor(doc);
//                       setIsBookModalOpen(true);
//                     }}
//                   >
//                     Request Appointment
//                   </button>
//                 </div>
//               ))
//             ) : (
//               <div className="col-span-2 text-center py-12 text-slate-500 text-sm">
//                 No healthcare professionals available on this filter track.
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="space-y-6">
//           <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 text-left">
//             <h2 className="text-lg font-bold text-slate-200 mb-4">Your Appointment Logs</h2>
            
//             {message && (
//               <div className="p-3 mb-4 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
//                 {message}
//               </div>
//             )}

//             <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
//               {appointments.length > 0 ? (
//                 appointments.map((appt) => (
//                   <div key={appt.id} className="p-4 bg-slate-950/60 border border-slate-900 rounded-xl space-y-3">
//                     <div className="flex justify-between items-center">
//                       <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
//                         <Calendar size={13} /> {appt.date}
//                       </div>
                      
//                       <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded ${
//                         appt.raw_status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
//                         appt.raw_status === 'under_review' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
//                         appt.raw_status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
//                         'bg-red-500/10 text-red-400 border border-red-500/20'
//                       }`}>
//                         {appt.raw_status.replace('_', ' ')}
//                       </span>
//                     </div>

//                     <div>
//                       <h4 className="font-bold text-sm text-slate-200">{appt.doctors?.full_name}</h4>
//                       <p className="text-[11px] text-slate-500 capitalize">{appt.doctors?.treatment_type} Specialist</p>
//                       <p className="text-xs text-slate-400 mt-1 italic">"{appt.disease_details}"</p>
//                     </div>

//                     {appt.raw_status === 'pending' && (
//                       <button 
//                         type="button"
//                         className="w-full text-xs py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30 rounded-xl transition-all"
//                         onClick={() => {
//                           setSelectedAppointment(appt);
//                           setIsPayModalOpen(true);
//                         }}
//                       >
//                         Upload Payment Proof
//                       </button>
//                     )}
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-12 text-slate-600 text-xs">
//                   No medical records booked under this profile card.
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>

//       <Modal isOpen={isBookModalOpen} onClose={() => setIsBookModalOpen(false)} title={`Book Slots: ${selectedDoctor?.full_name}`}>
//         <form onSubmit={handleBookAppointment} className="space-y-4 text-left">
//           <div>
//             <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">Preferred Appointment Date</label>
//             <input 
//               type="date" 
//               value={appointmentDate}
//               onChange={(e) => setAppointmentDate(e.target.value)}
//               className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
//               required 
//             />
//           </div>
//           <div className="flex flex-col gap-2">
//             <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Current Medical Symptoms</label>
//             <textarea
//               className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-3 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 h-24"
//               placeholder="Provide symptoms details..."
//               value={diseaseDescription}
//               onChange={(e) => setDiseaseDescription(e.target.value)}
//               required
//             />
//           </div>
//           <div className="pt-2 flex justify-end gap-2">
//             <Button variant="secondary" onClick={() => setIsBookModalOpen(false)}>Cancel</Button>
//             <Button type="submit" variant="primary">Submit Booking</Button>
//           </div>
//         </form>
//       </Modal>

//       <Modal isOpen={isPayModalOpen} onClose={() => setIsPayModalOpen(false)} title="Simulate Voucher Verification">
//         <form onSubmit={handlePaymentSubmit} className="space-y-4 text-left">
//           <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-2 text-slate-400">
//             <p className="font-bold text-slate-300">🏦 Hospital Account Ledger:</p>
//             <p>Bank: Clinical Care Desk Network Ltd.</p>
//             <p>Account ID: 0993-2281-9923-112</p>
//             <p className="text-emerald-400 font-bold">Total Consultation Fee: Rs. {selectedAppointment?.doctors?.fee}</p>
//           </div>
          
//           <div>
//             <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">Transaction Receipt URL / Reference ID</label>
//             <input 
//               type="text" 
//               placeholder="Enter Bank Transfer Reference or Image URL" 
//               value={transactionCode}
//               onChange={(e) => setTransactionCode(e.target.value)}
//               className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
//               required 
//             />
//           </div>

//           <div className="pt-2 flex justify-end gap-2">
//             <Button variant="secondary" onClick={() => setIsPayModalOpen(false)}>Cancel</Button>
//             <Button type="submit" variant="primary">Submit Receipt</Button>
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
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { PageTransition } from '../components/ui/PageTransition';
import jsPDF from 'jspdf'; // Import added
import { 
  LogOut, Activity, Search, Calendar, Clock, CreditCard, FileText, Download 
} from 'lucide-react';

export default function PatientDashboard() {
  const { user, profile, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]); 
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  
  const [searchDisease, setSearchDisease] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [diseaseDescription, setDiseaseDescription] = useState('');
  
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [transactionCode, setTransactionCode] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user || profile) {
      fetchPatientData();
      fetchDoctors();
      fetchPrescriptions();
    }
  }, [user, profile]);

  const fetchPrescriptions = async () => {
    try {
      const patientId = profile?.id || user?.id;
      const { data, error } = await supabase
        .from('medical_history')
        .select('*')
        .eq('patient_id', patientId);
      
      if (error) throw error;
      if (data) {
        setPrescriptions(data);
      }
    } catch (err) {
      console.error("Prescription Error:", err);
    }
  };

  // PDF Generation Function
  const downloadPrescription = (p) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Medical Prescription", 20, 20);
    doc.setFontSize(12);
    doc.text(`Date: ${new Date(p.created_at).toLocaleDateString()}`, 20, 30);
    doc.text(`Diagnosis: ${p.diagnosis}`, 20, 40);
    doc.text("Notes/Advice:", 20, 50);
    doc.text(p.notes || "No additional notes provided.", 20, 60, { maxWidth: 170 });
    doc.save(`Prescription_${p.id}.pdf`);
  };

  useEffect(() => {
    let result = doctors;
    if (selectedCategory !== 'All') {
      result = result.filter(doc => doc.treatment_type?.toLowerCase() === selectedCategory.toLowerCase());
    }
    if (searchDisease.trim() !== '') {
      result = result.filter(doc => {
        const specializationMatch = doc.specialization?.toLowerCase().includes(searchDisease.toLowerCase());
        const nameMatch = doc.full_name?.toLowerCase().includes(searchDisease.toLowerCase());
        return specializationMatch || nameMatch;
      });
    }
    setFilteredDoctors(result);
  }, [searchDisease, selectedCategory, doctors]);

  const fetchPatientData = async () => {
    try {
      const targetPatientId = profile?.id || user?.id;
      if (!targetPatientId) return;

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id, 
          appointment_date, 
          status, 
          disease_description,
          doctors ( treatment_type, consultation_fee, users ( full_name ) ),
          payments ( id, receipt_url, amount, status )
        `)
        .eq('patient_id', targetPatientId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedAppts = data?.map(appt => {
        const dbStatus = appt.status ? String(appt.status).toLowerCase() : 'pending';
        
        const paymentsArray = Array.isArray(appt.payments) ? appt.payments : (appt.payments ? [appt.payments] : []);
        const payment = paymentsArray.length > 0 ? paymentsArray[0] : null;
        const hasReceipt = payment && payment.receipt_url && payment.receipt_url.trim() !== '';
        
        let displayStatus = dbStatus;
        if (dbStatus === 'pending' && hasReceipt) {
          displayStatus = 'under_review';
        }

        return {
          ...appt,
          date: appt.appointment_date, 
          disease_details: appt.disease_description,
          raw_status: displayStatus, 
          doctors: appt.doctors ? {
            ...appt.doctors,
            fee: appt.doctors.consultation_fee,
            full_name: appt.doctors.users?.full_name || 'Medical Officer'
          } : null
        };
      }) || [];

      setAppointments(formattedAppts);
    } catch (err) {
      console.error("Fetch Patient Data Error: ", err.message);
    }
  };

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('doctors')
        .select(`
          id, 
          treatment_type, 
          specialization, 
          consultation_fee, 
          experience_years,
          is_available,
          users ( full_name )
        `);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const UIFormattedDoctors = data.map(doc => ({
          id: doc.id,
          full_name: doc.users?.full_name || 'Registered Doctor Account',
          treatment_type: doc.treatment_type || 'General',
          specialization: doc.specialization || 'Clinical Practitioner',
          fee: doc.consultation_fee || 1500,
          availability: doc.is_available ? 'Active Profile' : 'Not Available'
        }));

        setDoctors(UIFormattedDoctors);
        setFilteredDoctors(UIFormattedDoctors);
      } else {
        setDoctors([]);
        setFilteredDoctors([]);
      }
    } catch (err) {
      console.error("Patient Panel Resource Map Error: ", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const actualPatientId = profile?.id || user?.id;
      if (!actualPatientId) {
        throw new Error("User session token or profile record not discovered.");
      }

      const { data: apptData, error: apptError } = await supabase
        .from('appointments')
        .insert([
          {
            patient_id: actualPatientId,
            doctor_id: selectedDoctor.id,
            appointment_date: appointmentDate,
            appointment_time: '10:00:00', 
            disease_description: diseaseDescription,
            status: 'pending' 
          }
        ])
        .select();

      if (apptError) throw apptError;
      
      if (apptData && apptData[0]) {
        const { error: payError } = await supabase
          .from('payments')
          .insert([
            {
              appointment_id: apptData[0].id,
              amount: selectedDoctor.fee,
              status: 'pending',
              receipt_url: ''
            }
          ]);
        if (payError) console.error("Initial Payment Record Error:", payError);
      }

      setIsBookModalOpen(false);
      setAppointmentDate('');
      setDiseaseDescription('');
      setMessage('Appointment requested successfully! Please complete payment.');
      
      await fetchPatientData();
    } catch (err) {
      alert(`Booking Sync Issue: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      setMessage('');

      const { data: checkPay } = await supabase
        .from('payments')
        .select('id')
        .eq('appointment_id', selectedAppointment.id);

      if (checkPay && checkPay.length === 0) {
        await supabase.from('payments').insert([
          { 
            appointment_id: selectedAppointment.id, 
            amount: selectedAppointment.doctors?.fee || 1500, 
            receipt_url: transactionCode, 
            status: 'pending' 
          }
        ]);
      } else {
        await supabase
          .from('payments')
          .update({ receipt_url: transactionCode, status: 'pending' })
          .eq('appointment_id', selectedAppointment.id);
      }

      await supabase
        .from('appointments')
        .update({ status: 'pending' }) 
        .eq('id', selectedAppointment.id);

      setIsPayModalOpen(false);
      setTransactionCode('');
      setMessage('Payment proof submitted successfully! Review pending.');
      
      await fetchPatientData();
      
    } catch (err) {
      console.error("Detailed Trace:", err);
      alert(`Payment submission database error: ${err.message}`);
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
            <h1 className="text-base font-bold uppercase tracking-wider text-white">Patient Portal Desk</h1>
            <p className="text-xs text-slate-400">Welcome back, {profile?.full_name || 'Patient'}</p>
          </div>
        </div>
        <Button variant="danger" size="sm" onClick={logout} className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2">
          Logout <LogOut size={14} />
        </Button>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-200 text-left">Find Healthcare Specialists</h2>
            
            <div className="relative w-full">
              <input 
                type="text"
                placeholder="Search by Disease focus or Doctor Name..."
                value={searchDisease}
                onChange={(e) => setSearchDisease(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {['All', 'Allopathic', 'Homeopathic', 'Herbal'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs font-semibold tracking-wide rounded-xl transition-all duration-200 ${
                    selectedCategory === cat 
                      ? 'bg-emerald-500 text-slate-950 shadow-md font-bold' 
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {cat} Track
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {loading && doctors.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-slate-400 text-sm animate-pulse">
                Fetching configuration profiles from cloud server nodes...
              </div>
            ) : filteredDoctors.length > 0 ? (
              filteredDoctors.map((doc) => (
                <div key={doc.id} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 text-left">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded-md border border-emerald-500/20">
                        {doc.treatment_type} Track
                      </span>
                      <span className="text-sm font-bold text-emerald-400">Rs. {doc.fee}</span>
                    </div>
                    <h3 className="font-bold text-base text-white">{doc.full_name.startsWith('Dr.') ? doc.full_name : `Dr. ${doc.full_name}`}</h3>
                    <p className="text-xs text-slate-400">Specialization: {doc.specialization}</p>
                    <p className="text-[11px] text-slate-500">Status: {doc.availability}</p>
                  </div>
                  
                  <button 
                    type="button"
                    className="w-full text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl transition-all"
                    onClick={() => {
                      setSelectedDoctor(doc);
                      setIsBookModalOpen(true);
                    }}
                  >
                    Request Appointment
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-12 text-slate-500 text-sm">
                No healthcare professionals available on this filter track.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 text-left">
            <h2 className="text-lg font-bold text-slate-200 mb-4">Your Appointment Logs</h2>
            
            {message && (
              <div className="p-3 mb-4 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                {message}
              </div>
            )}

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {appointments.length > 0 ? (
                appointments.map((appt) => (
                  <div key={appt.id} className="p-4 bg-slate-950/60 border border-slate-900 rounded-xl space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                        <Calendar size={13} /> {appt.date}
                      </div>
                      
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded ${
                        appt.raw_status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        appt.raw_status === 'under_review' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        appt.raw_status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {appt.raw_status.replace('_', ' ')}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-slate-200">{appt.doctors?.full_name}</h4>
                      <p className="text-[11px] text-slate-500 capitalize">{appt.doctors?.treatment_type} Specialist</p>
                      <p className="text-xs text-slate-400 mt-1 italic">"{appt.disease_details}"</p>
                    </div>

                    {appt.raw_status === 'pending' && (
                      <button 
                        type="button"
                        className="w-full text-xs py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30 rounded-xl transition-all"
                        onClick={() => {
                          setSelectedAppointment(appt);
                          setIsPayModalOpen(true);
                        }}
                      >
                        Upload Payment Proof
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-600 text-xs">
                  No medical records booked under this profile card.
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 text-left">
            <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
              <FileText size={18} className="text-emerald-400" /> My Prescriptions
            </h2>
            <div className="space-y-3">
              {prescriptions.length > 0 ? (
                prescriptions.map((p) => (
                  <div key={p.id} className="p-3 bg-slate-950/60 border border-slate-900 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="text-sm text-white font-medium">{p.diagnosis}</p>
                      <p className="text-[10px] text-slate-500">{new Date(p.created_at).toLocaleDateString()}</p>
                    </div>
                    
                    {/* DOWNLOAD BUTTON TRIGGER */}
                    <button 
                      onClick={() => downloadPrescription(p)}
                      className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors"
                      title="Download PDF Prescription"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 text-center py-4">No prescriptions found.</p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Modal isOpen={isBookModalOpen} onClose={() => setIsBookModalOpen(false)} title={`Book Slots: ${selectedDoctor?.full_name}`}>
        <form onSubmit={handleBookAppointment} className="space-y-4 text-left">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">Preferred Appointment Date</label>
            <input 
              type="date" 
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              required 
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Current Medical Symptoms</label>
            <textarea
              className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-3 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 h-24"
              placeholder="Provide symptoms details..."
              value={diseaseDescription}
              onChange={(e) => setDiseaseDescription(e.target.value)}
              required
            />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsBookModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Submit Booking</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isPayModalOpen} onClose={() => setIsPayModalOpen(false)} title="Simulate Voucher Verification">
        <form onSubmit={handlePaymentSubmit} className="space-y-4 text-left">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-2 text-slate-400">
            <p className="font-bold text-slate-300">🏦 Hospital Account Ledger:</p>
            <p>Bank: Clinical Care Desk Network Ltd.</p>
            <p>Account ID: 0993-2281-9923-112</p>
            <p className="text-emerald-400 font-bold">Total Consultation Fee: Rs. {selectedAppointment?.doctors?.fee}</p>
          </div>
          
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">Transaction Receipt URL / Reference ID</label>
            <input 
              type="text" 
              placeholder="Enter Bank Transfer Reference or Image URL" 
              value={transactionCode}
              onChange={(e) => setTransactionCode(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              required 
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsPayModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Submit Receipt</Button>
          </div>
        </form>
      </Modal>
    </PageTransition>
  );
}