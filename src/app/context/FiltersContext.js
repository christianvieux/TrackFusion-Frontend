import { createContext, useState, useContext } from 'react';

const FiltersContext = createContext();

export const FiltersProvider = ({ children }) => {
  const [filtersApplied, setFiltersApplied] = useState([]);

  return (
    <FiltersContext.Provider value={{ filtersApplied, setFiltersApplied }}>
      {children}
    </FiltersContext.Provider>
  );
};

export const useFilters = () => {
  return useContext(FiltersContext);
};