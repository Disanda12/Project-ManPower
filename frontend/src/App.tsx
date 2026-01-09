import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
// 1. Import the Toaster component
import { Toaster } from 'react-hot-toast';

import NavigationBar from './components/navBar/NavigationBar';
import Home from './components/home/Home';
import AboutUs from './components/aboutUs/AboutUs';
import GlobalFooter from './components/footer/GlobalFooter';
import ContactUs from './components/contactUs/ContactUs';
import HireWorkerForm from './components/customerBooking/Booking';
import LoginPage from './components/Login/Login';
import BookingHistory from './components/bookingHistory/BookingHistory';
import ManageBookings from './components/bookingHistory/BookingManagement'; 
import IndustriesPage from './components/industries/Industries';
import SignUp from './components/signUp/SignUp';
import AdminBookingManager from './components/admin/bookingManagement/BookingMangement';
import AdminFeedbackManager from './components/admin/adminFeedback/AdminFeedbackManager';

function App() {
  return (
    <BrowserRouter>
      <Toaster 
        position="top-right" 
        reverseOrder={false} 
        gutter={8}
        toastOptions={{
          duration: 3000, 
        }}
      />
      
      <div className="flex flex-col min-h-screen">
        <NavigationBar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/booking" element={<HireWorkerForm />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/booking-history" element={<BookingHistory />} />
            <Route path="/manage-bookings" element={<ManageBookings />} />
            <Route path="/industries" element={<IndustriesPage />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/admin/bookings" element={<AdminBookingManager />} />
            <Route path="/admin/feedbacks" element={<AdminFeedbackManager />} />
          </Routes>
        </main>

        <GlobalFooter />
      </div>
    </BrowserRouter>
  );
}

export default App;