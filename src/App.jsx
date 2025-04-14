import { useState, useEffect } from 'react';
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';
import { Navigate, useNavigate } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';

export default function App() {
  const navigate = useNavigate(); // programmatic nav :contentReference[oaicite:1]{index=1}
  const [authenticated, setAuthenticated] = useState(
    Boolean(localStorage.getItem('access'))
  );
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize(); // track window dims :contentReference[oaicite:2]{index=2}

  // auto-hide confetti after 5s
  useEffect(() => {
    if (!showConfetti) return;
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, [showConfetti]);

  const handleSuccess = () => {
    setShowConfetti(true);
    setAuthenticated(true);
    Navigate('/dashboard');
  };

  return (
    <div className="h-screen bg-gray-100 relative">
      {/* 🎉 Confetti overlay */}
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={300}
          gravity={0.2}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999 }}
        />
      )}

      {/* show form until auth, then dashboard */}
      {!authenticated ? (
        <AuthForm
          isLogin={true}
          onClose={() => {}}
          onSuccess={handleSuccess}
        />
      ) : (
        <Dashboard />
      )}
    </div>
  );
}
