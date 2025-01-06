import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="float-bottom flex-row justify-center">
      <hr />
      <div className="footer-container flex flex-wrap justify-center text-center gap-3">
        <p className="text-green-light inline-block">&copy; {currentYear} Christian V. All rights reserved.</p>
        <ul className="footer-menu flex flex-wrap gap-8 justify-center">
          <li className="inline-block">
            <a className="text-green-light" href="/home">Home</a>
          </li>
          <li className="inline-block">
            <a className="text-green-light" href="/about">About</a>
          </li>
          <li className="inline-block">
            <a className="text-green-light" href="/terms">Terms</a>
          </li>
          <li className="inline-block">
            <a className="text-green-light" href="/privacy">Privacy</a>
          </li>
          <li className="inline-block">
            <a className="text-green-light" href="/contact">Contact</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}