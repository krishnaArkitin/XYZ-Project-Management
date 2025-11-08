

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

const InputField: React.FC<{id: string, label: string, type: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string, required?: boolean}> = 
({ id, label, type, value, onChange, placeholder, required = true }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700">
            {label}
        </label>
        <div className="mt-1">
            <input
                id={id}
                name={id}
                type={type}
                required={required}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-shadow"
            />
        </div>
    </div>
);

const LoginPage: React.FC = () => {
  const { login, signup } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState<UserRole>(UserRole.Client);
  const [signupError, setSignupError] = useState('');


  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = await login(loginEmail, loginPassword);
    if (!success) {
      setLoginError(`Invalid credentials. Please check email/password. Try: john.doe@example.com / password123, admin@xyz.com / admin123, or contact@innovate.com / vendor123.`);
    }
  };
  
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    if (!signupPassword || signupPassword.length < 6) {
        setSignupError('Password must be at least 6 characters long.');
        return;
    }
    const success = await signup(signupName, signupEmail, signupPassword, signupRole);
    if (!success) {
        setSignupError('Signup failed. User might already exist or invalid data.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h1 className="text-3xl font-bold text-indigo-600">XYZ Corp</h1>
        <h2 className="mt-6 text-2xl font-extrabold text-slate-900">
          {activeTab === 'login' ? 'Sign in to your account' : 'Create your new account'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-4 shadow-2xl sm:rounded-2xl sm:px-10">
          <div className="mb-8">
            <div className="flex border-b border-slate-200">
                <button 
                    onClick={() => setActiveTab('login')}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'login' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Sign In
                </button>
                <button 
                    onClick={() => setActiveTab('signup')}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'signup' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Sign Up
                </button>
            </div>
          </div>
          
          {activeTab === 'login' ? (
            <form className="space-y-6" onSubmit={handleLoginSubmit}>
              <InputField id="email" label="Email address" type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="you@example.com" />
              <InputField id="password" label="Password" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="••••••••" />
              {loginError && <p className="text-sm text-red-600">{loginError}</p>}
              <div>
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                  Sign In
                </button>
              </div>
            </form>
          ) : (
             <form className="space-y-6" onSubmit={handleSignupSubmit}>
                <InputField id="name" label="Full Name" type="text" value={signupName} onChange={(e) => setSignupName(e.target.value)} placeholder="John Doe" />
                <InputField id="signup-email" label="Email Address" type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} placeholder="you@company.com" />
                <InputField id="signup-password" label="Password" type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} placeholder="••••••••" />
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">I am a...</label>
                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input type="radio" name="role" value={UserRole.Client} checked={signupRole === UserRole.Client} onChange={() => setSignupRole(UserRole.Client)} className="h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500" />
                            <span className="ml-2 text-sm text-slate-800">Client</span>
                        </label>
                         <label className="flex items-center">
                            <input type="radio" name="role" value={UserRole.Vendor} checked={signupRole === UserRole.Vendor} onChange={() => setSignupRole(UserRole.Vendor)} className="h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500" />
                            <span className="ml-2 text-sm text-slate-800">Vendor</span>
                        </label>
                    </div>
                </div>
                {signupError && <p className="text-sm text-red-600">{signupError}</p>}
                <div className="text-center text-xs text-slate-500 pt-2">
                    Admin accounts are created internally.
                </div>
                <div>
                    <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                      Create Account
                    </button>
                </div>
             </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;