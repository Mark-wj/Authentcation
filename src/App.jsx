import { useState } from 'react';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import { Navigate } from 'react-router-dom';

export default function App(setShowAuthForm) {
  const [authenticated, setAuthenticated] = useState(
    Boolean(localStorage.getItem('access'))
  );

  if (authenticated) {
    return <Dashboard />;
  }

  return (
    <div className="h-screen bg-gray-100">
        <AuthForm 
  isLogin={true}
  onClose={() => setShowAuthForm(false)}
  onSuccess={() => {
    setAuthenticated(true);
    Navigate('/dashboard');
  }}
/>

    </div>
  );
}