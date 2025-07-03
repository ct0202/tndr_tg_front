import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../axios";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setIsLoading(false);
      setUser(null);
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post("/auth/getUserById", { userId });
      setUser(res.data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}; 