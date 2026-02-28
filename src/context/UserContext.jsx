import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../api/axios';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });

  const refreshUser = async () => {
    try {
      const { data } = await auth.me();
      const u = data.user;
      setUser(u);
      localStorage.setItem('user', JSON.stringify(u));
      return u;
    } catch (err) {
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      setUser(null);
      return;
    }
    refreshUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used inside UserProvider');
  return ctx;
}
