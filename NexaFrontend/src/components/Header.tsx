'use client'

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Polls', path: '/polls' },
    { name: 'Create', path: '/create' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <style jsx global>{`
        :root {
          /* Modern Color Scheme */
          --primary: #4f46e5;         /* Indigo-600 */
          --primary-hover: #4338ca;   /* Indigo-700 */
          --primary-light: #eef2ff;   /* Indigo-50 */
          --text-primary: #1f2937;    /* Gray-800 */
          --text-secondary: #6b7280;  /* Gray-500 */
          --bg-secondary: #f9fafb;    /* Gray-50 */
          --bg-hover: #f3f4f6;        /* Gray-100 */
          --border: #e5e7eb;          /* Gray-200 */
          --radius: 0.75rem;          /* 12px border radius */
          --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
          --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          --transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Base button styles */
        appkit-button, appkit-network-button {
          font-family: 'Inter', -apple-system, sans-serif;
          font-weight: 500;
          border: 1px solid transparent;
          cursor: pointer;
          transition: var(--transition);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
          user-select: none;
        }

        /* Connect Wallet Button */
        appkit-button {
          --appkit-button-bg: var(--primary);
          --appkit-button-bg-hover: var(--primary-hover);
          --appkit-button-color: white;
          --appkit-button-border-radius: var(--radius);
          --appkit-button-padding: 0.625rem 1.25rem;
          --appkit-button-font-size: 0.9375rem;
          --appkit-button-font-weight: 500;
          --appkit-button-box-shadow: var(--shadow);
          --appkit-button-border: none;
          height: 2.75rem;
          min-width: 120px;
        }

        appkit-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        }

        appkit-button:active {
          transform: translateY(0);
          box-shadow: var(--shadow-sm);
        }

        /* Network Button */
        appkit-network-button {
          --appkit-network-button-bg: var(--bg-secondary);
          --appkit-network-button-bg-hover: var(--bg-hover);
          --appkit-network-button-color: var(--text-primary);
          --appkit-network-button-border-radius: var(--radius);
          --appkit-network-button-padding: 0.5rem 1rem;
          --appkit-network-button-font-size: 0.875rem;
          --appkit-network-button-border: 1px solid var(--border);
          height: 2.75rem;
          margin-right: 0.75rem;
        }

        appkit-network-button:hover {
          background-color: var(--bg-hover);
          transform: translateY(-1px);
          box-shadow: var(--shadow-sm);
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          appkit-button, appkit-network-button {
            --appkit-button-padding: 0.5rem 1rem;
            --appkit-network-button-padding: 0.375rem 0.75rem;
            height: 2.5rem;
            font-size: 0.875rem;
          }
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">NexaPoll</span>
            </Link>
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`${
                    pathname === link.path
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
            <appkit-button balance='hide' />
            <appkit-network-button />
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`${
                  pathname === link.path
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center justify-between px-4">
              <div className="ml-3">
                <appkit-network-button />
              </div>
              <appkit-button balance='hide'/>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};

export default Header;