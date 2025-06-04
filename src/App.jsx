import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/ui/Navigation';
import Landing from './components/Landing';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Kyc from './components/auth/Kyc';
import Home from './components/Home';
import Marketplace from './components/Marketplace';
import PropertyDetail from './components/PropertyDetail';
import Wallet from './components/Wallet';
import Admin from './components/Admin';
import Billing from './components/Billing';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/kyc" element={<Kyc />} />
          <Route path="/home" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
