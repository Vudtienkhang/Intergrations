import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserContent = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true); 

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUser({ id: storedUserId });
    }
    setIsAuthenticating(false); 
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("userId", userData.id);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userId");
  };

  const isLoggedIn = !!user;

  return (
    <UserContext.Provider
      value={{ user, login, logout, isLoggedIn, isAuthenticating }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
