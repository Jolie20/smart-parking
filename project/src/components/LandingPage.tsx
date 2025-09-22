import React, { useEffect, useState } from 'react';
import { lotService } from '../services/lotService';
import SignupPage  from './signup';
import { Car, Shield, Clock, Smartphone, ArrowRight, MapPin, Users, BarChart3 } from 'lucide-react';
import { set } from 'mongoose';

interface LandingPageProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onSignupClick }) => {
  const [lotsSummary, setLotsSummary] = useState<{ totalLots: number; totalSpots: number; availableSpots: number } | null>(null);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const lots = await lotService.list();
        const totalLots = (lots || []).length;
        const totalSpots = (lots || []).reduce((sum: number, l: any) => sum + (l.totalSpots || 0), 0);
        const availableSpots = (lots || []).reduce((sum: number, l: any) => sum + (l.availableSpots || 0), 0);
        setLotsSummary({ totalLots, totalSpots, availableSpots });
      } catch (e) {
        setLotsSummary(null);
      }
    };
    load();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="px-6 py-4 bg-white/90 backdrop-blur-md border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center space-x-2">
            <Car className="h-7 w-7 text-blue-600" />
            <span className="text-xl md:text-2xl font-bold text-gray-900">
              SmartPark
            </span>
          </div>

          {/* Center: Nav */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
            <a href="#home" className="hover:text-gray-900">
              Home
            </a>
            <a href="#pricing" className="hover:text-gray-900">
              Pricing
            </a>
            <a href="#contact" className="hover:text-gray-900">
              Contact
            </a>
          </nav>

          {/* Right: Auth Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onLoginClick}
              className="px-4 py-2 rounded-md text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300 bg-white shadow-sm"
            >
              Login
            </button>
            <button
              onClick={()=>setShowSignup(true)}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Smart Parking
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}
              Made Simple
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto leading-relaxed">
            Book parking spots ahead of time, check in with RFID cards, and enjoy seamless parking experiences with real-time availability and automated billing.
          </p>
          {lotsSummary && (
            <div className="mb-8 text-gray-700">
              <span className="inline-flex items-center space-x-2 bg-white/70 border border-gray-200 rounded-lg px-4 py-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span>
                  {lotsSummary.availableSpots} available spots across {lotsSummary.totalLots} lots
                </span>
              </span>
            </div>
          )}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={()=>setShowSignup(true)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <span>Get Started</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={onLoginClick}
              className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors border border-gray-200 shadow-lg hover:shadow-xl"
            >
              Login to Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Why Choose SmartPark?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Smartphone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Easy Booking
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Reserve your parking spot in advance through our intuitive
                mobile and web interface. Never worry about finding a spot
                again.
              </p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                RFID Access
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Seamless check-in and check-out with RFID cards. Automatic timer
                tracking and billing for a hassle-free experience.
              </p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Real-time Tracking
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Monitor your parking duration in real-time and get transparent
                billing based on actual usage time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="px-6 py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Built for Everyone
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  Customers
                </h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Book parking spots in advance</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Manage vehicle information</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Track parking history</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>View billing details</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  Managers
                </h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>Monitor entry and exit activities</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>Manage parking lot capacity</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>View occupancy statistics</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>Handle customer issues</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">Admins</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span>Full system oversight</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span>Manage all users and lots</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span>Analytics and reporting</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span>System configuration</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-6 py-12">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Car className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold">SmartPark</span>
          </div>
          <p className="text-gray-400 mb-6">
            The future of parking management is here
          </p>
          <p className="text-gray-500 text-sm">
            © 2025 SmartPark. All rights reserved.
          </p>
        </div>
      </footer>
      <SignupPage isOpen={showSignup} onClose={() => setShowSignup(false)} />
    </div>
  );
};

export default LandingPage;
