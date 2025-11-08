import React from 'react';
import { Link } from 'react-router-dom';

const LandingNavbar: React.FC = () => (
  <nav className="bg-white/90 backdrop-blur-lg shadow-sm fixed w-full z-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex-shrink-0">
          <Link to="/" className="text-2xl font-bold text-indigo-600">XYZ Corp</Link>
        </div>
        <div className="hidden md:block">
          <div className="ml-10 flex items-center space-x-4">
            <a href="#features" className="text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Features</a>
            <a href="#how-it-works" className="text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">How It Works</a>
            <Link to="/login" className="ml-4 px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105">
              Login / Signup
            </Link>
          </div>
        </div>
      </div>
    </div>
  </nav>
);

const Footer: React.FC = () => (
    <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-sm font-semibold text-slate-500 tracking-wider uppercase">Product</h3>
                    <ul className="mt-4 space-y-4">
                        <li><a href="#" className="text-base text-slate-600 hover:text-slate-900">Features</a></li>
                        <li><a href="#" className="text-base text-slate-600 hover:text-slate-900">Pricing</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-slate-500 tracking-wider uppercase">Company</h3>
                    <ul className="mt-4 space-y-4">
                        <li><a href="#" className="text-base text-slate-600 hover:text-slate-900">About</a></li>
                        <li><a href="#" className="text-base text-slate-600 hover:text-slate-900">Contact</a></li>
                    </ul>
                </div>
                 <div>
                    <h3 className="text-sm font-semibold text-slate-500 tracking-wider uppercase">Resources</h3>
                    <ul className="mt-4 space-y-4">
                        <li><a href="#" className="text-base text-slate-600 hover:text-slate-900">Blog</a></li>
                        <li><a href="#" className="text-base text-slate-600 hover:text-slate-900">Help Center</a></li>
                    </ul>
                </div>
            </div>
            <div className="mt-12 border-t border-slate-200 pt-8 flex flex-col sm:flex-row justify-between items-center">
                <p className="text-base text-slate-500">&copy; 2024 XYZ Corp. All rights reserved.</p>
                <div className="flex space-x-6 mt-4 sm:mt-0">
                    {/* Social media icons can go here */}
                </div>
            </div>
        </div>
    </footer>
);

const Feature: React.FC<{icon: string, title: string, children: React.ReactNode}> = ({icon, title, children}) => (
    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
        <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-indigo-100 text-indigo-600">
            <span className="text-3xl">{icon}</span>
        </div>
        <div className="mt-5">
            <h3 className="text-xl leading-6 font-bold text-slate-900">{title}</h3>
            <p className="mt-2 text-base text-slate-600">{children}</p>
        </div>
    </div>
);


const LandingPage: React.FC = () => {
  return (
    <div className="bg-white">
      <LandingNavbar />
      
      <main>
        {/* Hero Section */}
        <div className="relative pt-24 pb-32 sm:pt-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/30 via-white to-white"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl">
                <span className="block">Intelligent Project Management</span>
                <span className="block text-indigo-600">for Modern Teams</span>
              </h1>
              <p className="mt-4 max-w-md mx-auto text-lg text-slate-600 sm:text-xl md:mt-6 md:max-w-3xl">
                Unify clients, vendors, and your team on a single, transparent platform. Drive projects from concept to completion with seamless collaboration and real-time insights.
              </p>
              <div className="mt-6 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div className="rounded-lg shadow">
                  <Link to="/login" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transform hover:-translate-y-1 transition-transform duration-300">
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <div id="features" className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Why Choose Us</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                A better way to build together
              </p>
              <p className="mt-4 max-w-2xl text-xl text-slate-600 lg:mx-auto">
                Our platform is designed to eliminate communication silos, enhance transparency, and empower every stakeholder in the project lifecycle.
              </p>
            </div>
            <div className="mt-16">
                <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-8">
                    <Feature icon="👥" title="Unified Dashboards">Role-specific dashboards provide clients, admins, and vendors with the exact information and tools they need.</Feature>
                    <Feature icon="📈" title="Real-time Progress">Visualize project health and track milestones with intuitive timelines and status indicators.</Feature>
                    <Feature icon="💬" title="Integrated Communication">Keep all project-related conversations and video calls in one place, linked directly to the project.</Feature>
                </dl>
            </div>
          </div>
        </div>

        {/* How it Works Section */}
        <div id="how-it-works" className="py-24 bg-white">
            <div className="max-w-2xl mx-auto px-4 text-center sm:px-6 lg:px-8 lg:max-w-7xl">
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">How It Works</h2>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-600">
                    Get your projects up and running in three simple steps.
                </p>
                <div className="mt-16 grid grid-cols-1 gap-y-12 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="text-center">
                        <span className="flex items-center justify-center mx-auto h-20 w-20 rounded-full bg-indigo-100 text-3xl font-bold text-indigo-600 ring-8 ring-indigo-50">1</span>
                        <h3 className="mt-6 text-lg font-medium text-slate-900">Create Project</h3>
                        <p className="mt-2 text-base text-slate-600">Clients or admins define the project scope, timeline, and requirements with our easy-to-use form.</p>
                    </div>
                    <div className="text-center">
                        <span className="flex items-center justify-center mx-auto h-20 w-20 rounded-full bg-indigo-100 text-3xl font-bold text-indigo-600 ring-8 ring-indigo-50">2</span>
                        <h3 className="mt-6 text-lg font-medium text-slate-900">Collaborate & Align</h3>
                        <p className="mt-2 text-base text-slate-600">Admins assign vendors, provide quotes, and facilitate communication through messaging and video calls.</p>
                    </div>
                    <div className="text-center">
                        <span className="flex items-center justify-center mx-auto h-20 w-20 rounded-full bg-indigo-100 text-3xl font-bold text-indigo-600 ring-8 ring-indigo-50">3</span>
                        <h3 className="mt-6 text-lg font-medium text-slate-900">Track & Complete</h3>
                        <p className="mt-2 text-base text-slate-600">Follow the project's progress on the timeline, get real-time updates, and celebrate completion.</p>
                    </div>
                </div>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;