// components/LogoutButton.js
import React from 'react';
import { useSession } from '../context/SessionContext';
import { logoutUser } from '../services/auth';
import { useRouter } from 'next/navigation';

const LogoutButton = () => {
  const { setUser } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      router.push('/'); // Redirect to home or any other page
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <button className='bg-pink-dark' onClick={handleLogout}>Logout</button>
  );
};

export default LogoutButton;
