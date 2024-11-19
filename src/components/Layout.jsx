import React from 'react';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div>
      {/* Header/Navbar */}
      <Header />
      <Sidebar />

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
