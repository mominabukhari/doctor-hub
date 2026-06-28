# Doctor Hub - Healthcare Consultation Platform

Doctor Hub is a production-style healthcare consultation and patient history management system designed to streamline clinical operations. It connects patients with doctors across various disciplines, including Allopathic, Homeopathic, and Herbal medicine.

## 🚀 Live Demo
https://doctor-hub-omega.vercel.app/

## 📋 Features
- **Doctor Search & Filtering:** Filter doctors based on disease and treatment type.
- **Appointment Booking:** Secure and seamless booking system.
- **Payment Verification:** Integrated payment screenshot verification for assistant approval.
- **Medical History:** Immutable medical history management.
- **Prescription Management:** Digitized prescriptions with PDF download functionality.
- **Role-Based Access Control (RBAC):** Separate dashboards for Patients, Doctors, Assistants, and Admins.

## 🔐 System Credentials for Testing
You can use the following credentials to explore different roles within the system:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Patient** | `patient@gmail.com` | `patient123` |
| **Administrator** | `administrator@gmail.com` | `administrator` |
| **Assistant** | `assistant@gmail.com` | `assistant123` |
| **Dr. Khalid** | `doctor@gmail.com` | `doctor123` |
| **Dr. Amna** | `amna@gmail.com` | `amna123` |
| **Dr. Hamza** | `hamza@gmail.com` | `hamza123` |
| **Dr. Humaira** | `humaira@gmail.com` | `humaira123` |

## 🛠 Tech Stack
- **Frontend:** React.js, Tailwind CSS
- **Backend/Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (JWT)
- **PDF Generation:** jsPDF

## 🏗 System Architecture
- **Row Level Security (RLS):** Implemented to ensure patient data privacy.
- **Database Triggers:** Automated patient profile creation and immutable record logs.
- **Cascading Deletes:** Managed integrity for related clinical records.

## 📈 Future Enhancements
- AI-based disease prediction integration.
- Real-time video consultation features.
- Automated WhatsApp/Email notification alerts.

## 📝 License
This project is for educational purposes as part of the Final Semester Project.
