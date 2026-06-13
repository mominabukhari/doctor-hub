import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { PageTransition } from '../components/ui/PageTransition';
import { Shield, Activity, Users, Award } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <PageTransition className="min-h-screen bg-[#020617] text-slate-100 flex flex-col justify-between font-sans antialiased selection:bg-emerald-500/30">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Navigation */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-5 flex justify-between items-center relative z-20 border-b border-slate-900/80 bg-slate-950/20 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_#10b981]" />
          <h1 className="text-xl font-bold tracking-wider bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            DOCTOR HUB
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/login')} className="text-sm">Sign In</Button>
          <Button variant="primary" onClick={() => navigate('/register')} className="text-sm bg-emerald-500 text-slate-950 px-4 py-2 rounded-xl font-semibold">Get Started</Button>
        </div>
      </nav>

      {/* Hero Body Content */}
      <main className="max-w-7xl w-full mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center py-16 relative z-10 flex-grow">
        <div className="space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            ⚡ Multi-Treatment Medical Desk
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
            Next-Gen Integrated <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Clinical Workspace</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed">
            Book consolidated appointments across Allopathic, Homeopathic, and Herbal practices. Track custom medical histories, manage prescriptions, and secure smart verification flows instantly.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Button size="lg" variant="primary" onClick={() => navigate('/register')} className="bg-emerald-500 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/20">
              Create Free Account
            </Button>
            <Button size="lg" variant="secondary" onClick={() => navigate('/login')} className="bg-slate-900 border border-slate-800 text-slate-300 px-6 py-3 rounded-xl">
              Access Dashboard
            </Button>
          </div>
        </div>

        {/* Right Columns Grid Layout */}
        <div className="grid sm:grid-cols-2 gap-6 relative">
          <GlassCard className="p-6 space-y-3 bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl text-left">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl w-fit text-emerald-400"><Activity size={22} /></div>
            <h3 className="font-bold text-lg text-slate-200">Multi-Channel Diagnosis</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Allopathic, Homeopathic, and Herbal medical records grouped directly under one portal.</p>
          </GlassCard>

          <GlassCard className="p-6 space-y-3 bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl text-left lg:translate-y-6">
            <div className="p-2.5 bg-teal-500/10 rounded-xl w-fit text-teal-400"><Shield size={22} /></div>
            <h3 className="font-bold text-lg text-slate-200">Secure Audit Vault</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Advanced document attachments upload system with instant assistant payment clearance flows.</p>
          </GlassCard>

          <GlassCard className="p-6 space-y-3 bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl text-left">
            <div className="p-2.5 bg-blue-500/10 rounded-xl w-fit text-blue-400"><Users size={22} /></div>
            <h3 className="font-bold text-lg text-slate-200">Synchronized Roles</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Dedicated operational layout views for Patients, Doctors, Assistants, and Admins.</p>
          </GlassCard>

          <GlassCard className="p-6 space-y-3 bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl text-left lg:translate-y-6">
            <div className="p-2.5 bg-purple-500/10 rounded-xl w-fit text-purple-400"><Award size={22} /></div>
            <h3 className="font-bold text-lg text-slate-200">Dynamic Treatment</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Instant prescription rendering engine with automatic follow-up reminders management.</p>
          </GlassCard>
        </div>
      </main>

      {/* Footer System */}
      <footer className="w-full text-center py-5 text-xs text-slate-600 border-t border-slate-900 bg-slate-950/80 relative z-20">
        &copy; {new Date().getFullYear()} DoctorHub Platform Inc. Final Academic Evaluation Project.
      </footer>
    </PageTransition>
  );
}