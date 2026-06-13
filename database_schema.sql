-- database_schema.sql
-- Run this in your Supabase SQL Editor

-- 1. Create Enums
CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'doctor', 'assistant', 'patient');
CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'verified', 'failed');

-- 2. Create Tables

-- Users Table (Extends Supabase Auth)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'patient',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clinics Table
CREATE TABLE clinics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Doctors Table
CREATE TABLE doctors (
  id UUID REFERENCES users(id) PRIMARY KEY,
  clinic_id UUID REFERENCES clinics(id),
  specialization TEXT NOT NULL,
  treatment_type TEXT NOT NULL, -- e.g., Allopathic, Homeopathic, Herbal
  experience_years INT,
  consultation_fee DECIMAL(10,2) NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patients Table
CREATE TABLE patients (
  id UUID REFERENCES users(id) PRIMARY KEY,
  date_of_birth DATE,
  gender TEXT,
  contact_number TEXT,
  address TEXT,
  blood_group TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assistants Table
CREATE TABLE assistants (
  id UUID REFERENCES users(id) PRIMARY KEY,
  clinic_id UUID REFERENCES clinics(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments Table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) NOT NULL,
  doctor_id UUID REFERENCES doctors(id) NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status appointment_status DEFAULT 'pending',
  disease_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments Table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES appointments(id) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  receipt_url TEXT, -- URL to uploaded screenshot
  status payment_status DEFAULT 'pending',
  verified_by UUID REFERENCES assistants(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Medical History Table (IMMUTABLE)
CREATE TABLE medical_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) NOT NULL,
  doctor_id UUID REFERENCES doctors(id) NOT NULL,
  appointment_id UUID REFERENCES appointments(id),
  diagnosis TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
  -- No updated_at because it's immutable
);

-- Prescriptions Table (IMMUTABLE)
CREATE TABLE prescriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  medical_history_id UUID REFERENCES medical_history(id) NOT NULL,
  medication_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  duration TEXT NOT NULL,
  instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistants ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;

-- Users Policy: Can view their own data. Admins can view all.
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid() = id);

-- Doctors Policy: Anyone can view available doctors.
CREATE POLICY "Anyone can view doctors" ON doctors FOR SELECT USING (true);

-- Patients Policy: Patients can view their own profile. Doctors can view their patients.
CREATE POLICY "Patients view own profile" ON patients FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Doctors view patients" ON patients FOR SELECT USING (
  EXISTS (SELECT 1 FROM appointments WHERE appointments.patient_id = patients.id AND appointments.doctor_id = auth.uid())
);

-- Appointments Policy:
CREATE POLICY "Patients view own appointments" ON appointments FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Patients can create appointments" ON appointments FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Doctors view their appointments" ON appointments FOR SELECT USING (auth.uid() = doctor_id);

-- Medical History Policy (Strict Immutable Rules)
-- 1. Patients can VIEW their history
CREATE POLICY "Patients view own history" ON medical_history FOR SELECT USING (auth.uid() = patient_id);
-- 2. Doctors can VIEW their patients' history
CREATE POLICY "Doctors view patient history" ON medical_history FOR SELECT USING (
  EXISTS (SELECT 1 FROM appointments WHERE appointments.patient_id = medical_history.patient_id AND appointments.doctor_id = auth.uid())
);
-- 3. Doctors can INSERT new history
CREATE POLICY "Doctors can insert history" ON medical_history FOR INSERT WITH CHECK (auth.uid() = doctor_id);
-- NO UPDATE OR DELETE POLICIES FOR medical_history! This makes it immutable from the client side.

-- Prescriptions Policy (Strict Immutable Rules)
CREATE POLICY "Patients view own prescriptions" ON prescriptions FOR SELECT USING (
  EXISTS (SELECT 1 FROM medical_history WHERE medical_history.id = prescriptions.medical_history_id AND medical_history.patient_id = auth.uid())
);
CREATE POLICY "Doctors view prescriptions" ON prescriptions FOR SELECT USING (
  EXISTS (SELECT 1 FROM medical_history WHERE medical_history.id = prescriptions.medical_history_id AND medical_history.doctor_id = auth.uid())
);
CREATE POLICY "Doctors can insert prescriptions" ON prescriptions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM medical_history WHERE medical_history.id = prescriptions.medical_history_id AND medical_history.doctor_id = auth.uid())
);
-- NO UPDATE OR DELETE POLICIES FOR prescriptions!

-- Database Triggers to enforce immutability at the DB level (prevents even super_admin from accidental updates via UI)
CREATE OR REPLACE FUNCTION prevent_update_delete()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'This record is immutable and cannot be updated or deleted.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER make_medical_history_immutable
BEFORE UPDATE OR DELETE ON medical_history
FOR EACH ROW EXECUTE FUNCTION prevent_update_delete();

CREATE TRIGGER make_prescriptions_immutable
BEFORE UPDATE OR DELETE ON prescriptions
FOR EACH ROW EXECUTE FUNCTION prevent_update_delete();
