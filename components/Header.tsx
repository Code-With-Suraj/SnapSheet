
import React from 'react';

const LogoIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-8 h-8 text-white"
  >
    <path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm5 4v2h2V7H9zm4 0v2h2V7h-2zm-4 4v2h2v-2H9zm4 0v2h2v-2h-2zm-4 4v2h2v-2H9zm4 0v2h2v-2h-2z" />
  </svg>
);

export const Header: React.FC = () => {
  return (
    <header className="bg-brand-primary shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center space-x-3">
          <div className="bg-brand-secondary p-2 rounded-lg">
            <LogoIcon />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">SnapSheet</h1>
            <p className="text-sm text-emerald-100">Instantly convert photos to Excel.</p>
          </div>
        </div>
      </div>
    </header>
  );
};
