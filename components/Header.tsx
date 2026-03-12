
import React from 'react';
import { Page } from '../types';

interface HeaderProps {
  activePage: Page;
}

const Header: React.FC<HeaderProps> = ({ activePage }) => {
  return (
    <header className="py-6 px-8">
      <h1 className="text-3xl font-bold text-dark-content">{activePage}</h1>
    </header>
  );
};

export default Header;
