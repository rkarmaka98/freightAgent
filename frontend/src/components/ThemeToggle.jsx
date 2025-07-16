import React, { useEffect, useState } from 'react';

// toggle button for switching between light and dark mode
export default function ThemeToggle() {
  // initialize theme from local storage when running in the browser
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('theme') === 'dark';
  });

  // apply theme changes to document root and store preference
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    window.localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  // switch theme when button clicked
  const toggle = () => setDark((prev) => !prev);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark} // convey toggle state to assistive tech
      className="theme-toggle"
    >
      {dark ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}
