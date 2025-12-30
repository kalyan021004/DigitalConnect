import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

/* Pages */
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import CitizenSchemes from "./pages/CitizenSchemes";
import MyApplications from "./pages/MyApplications";
import AdminApplications from "./pages/AdminApplications";
import SchemeDetail from "./pages/SchemeDetail";
import ApplicationDetail from "./pages/ApplicationDetail";
import CreateGrievance from "./pages/CreateGrievance";
import MyGrievances from "./pages/MyGrievances";
import PanchayatGrievances from "./pages/PanchayatGrievances";
import GrievanceDetail from "./pages/GrievanceDetail";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorAppointmentDetail from "./pages/DoctorAppointmentDetail";
import BookAppointment from "./pages/BookAppointment";
import Doctor from "./pages/Doctor";
import MyAppointments from "./pages/MyAppointments";
import AppointmentDetail from "./pages/AppointmentDetail";
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes className="app-dark">
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Citizen */}
          <Route path="/schemes" element={<ProtectedRoute roles={["citizen"]}><CitizenSchemes /></ProtectedRoute>} />
          <Route path="/my-applications" element={<ProtectedRoute roles={["citizen"]}><MyApplications /></ProtectedRoute>} />
          <Route path="/schemes/:id" element={<ProtectedRoute roles={["citizen"]}><SchemeDetail /></ProtectedRoute>} />
          <Route path="/applications/:id" element={<ProtectedRoute roles={["citizen", "state_admin"]}><ApplicationDetail /></ProtectedRoute>} />
          <Route path="/admin/applications"
          element={
            <ProtectedRoute roles={["state_admin"]}>
              <AdminApplications />
            </ProtectedRoute>
          }
          />
          {/* Grievances */}
          <Route path="/grievance/new" element={<ProtectedRoute roles={["citizen"]}><CreateGrievance /></ProtectedRoute>} />
          <Route path="/grievance/mine" element={<ProtectedRoute roles={["citizen"]}><MyGrievances /></ProtectedRoute>} />
          <Route path="/grievance/panchayat" element={<ProtectedRoute roles={["gram_panchayat"]}><PanchayatGrievances /></ProtectedRoute>} />
          <Route path="/grievances/:id" element={<ProtectedRoute roles={["citizen", "gram_panchayat"]}><GrievanceDetail /></ProtectedRoute>} />

          {/* Health */}
          <Route path="/health/doctors" element={<Doctor />} />
          <Route path="/book-appointment/:doctorId" element={<ProtectedRoute roles={["citizen"]}><BookAppointment /></ProtectedRoute>} />

          {/* Appointments */}
          <Route path="/my-appointments" element={<ProtectedRoute roles={["citizen"]}><MyAppointments /></ProtectedRoute>} />
          <Route path="/appointments/:id" element={<ProtectedRoute roles={["citizen", "doctor_admin"]}><AppointmentDetail /></ProtectedRoute>} />

          
          <Route path="/doctor/appointments" element={<ProtectedRoute roles={["doctor_admin"]}><DoctorAppointments /></ProtectedRoute>} />
          <Route path="/doctor/appointments/:id" element={<ProtectedRoute roles={["doctor_admin"]}><DoctorAppointmentDetail /></ProtectedRoute>} />
        </Routes>
        


      </BrowserRouter>
    </AuthProvider>
  );
}