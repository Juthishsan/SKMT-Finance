import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import UnderMaintenance from './components/underMaintanance';
import Home from './pages/Home';
import Loans from './pages/Loans';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import LoanDetails from './pages/LoanDetails';
import ScrollToTop from './components/ScrollToTop';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Profile from './pages/Profile';
import SellVehicle from './pages/SellVehicle.jsx';
import SessionWarningModal from './components/SessionWarningModal';
import { useAuth } from './AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

function App() {
  const { sessionWarning, setSessionWarning } = useAuth();
  return (
    <>
      <ScrollToTop />
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/maintanance" element={<UnderMaintenance />} />
            <Route path="/" element={<UnderMaintenance />} />
            <Route path="/loans" element={<UnderMaintenance />} />
            <Route path="/loans/:id" element={<UnderMaintenance />} />
            <Route path="/products" element={<UnderMaintenance />} />
            <Route path="/products/:id" element={<UnderMaintenance />} />
            <Route path="/services" element={<UnderMaintenance />} />
            <Route path="/about" element={<UnderMaintenance />} />
            <Route path="/contact" element={<UnderMaintenance />} />
            <Route path="/login" element={<UnderMaintenance />} />
            <Route path="/register" element={<UnderMaintenance />} />
            <Route path="/forgot-password" element={<UnderMaintenance />} />
            <Route path="/reset-password/:token" element={<UnderMaintenance />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/sell-vehicle" element={<ProtectedRoute><SellVehicle /></ProtectedRoute>} />
          </Routes>


          {/* <Routes>
            <Route path="/maintanance" element={<UnderMaintenance />} />
            <Route path="/" element={<Home />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/loans/:id" element={<LoanDetails />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/sell-vehicle" element={<ProtectedRoute><SellVehicle /></ProtectedRoute>} />
          </Routes> */}



        </main>
        <Footer />
      </div>
      {sessionWarning && (
        <SessionWarningModal onDismiss={() => setSessionWarning(false)} />
      )}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </>
  );
}

export default App;