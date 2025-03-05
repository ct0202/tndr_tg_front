import React, { createContext, useState, useContext } from "react";

// Создаем контекст
const FiltersContext = createContext();

// Хук для использования контекста
export const useFilters = () => useContext(FiltersContext);

// Провайдер контекста
export const FiltersProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    name: "",
  });

  const [findFilters, setFindFilters] = useState({
    age: null,
    gender: null,
    distance: null,
    status: null,
  });

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
  const updateFindFilter = (key, value) => {
    setFindFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <FiltersContext.Provider value={{ filters, updateFilter, updateFindFilter, findFilters }}>
      {children}
    </FiltersContext.Provider>
  );
};
