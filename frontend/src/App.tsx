import React from 'react';
// Change 'Router' to 'BrowserRouter' in your import
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
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


function App() {
  return (
    // Use BrowserRouter here instead of the base Router
    <BrowserRouter>
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

          </Routes>
        </main>

        <GlobalFooter />
      </div>
    </BrowserRouter>
  );
}

export default App;