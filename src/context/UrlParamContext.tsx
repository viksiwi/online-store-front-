import { createContext, useContext, useState, useEffect, ReactNode, FC } from 'react';
import { useSearchParams } from 'react-router-dom';

interface UrlParamsContextType {
  params: URLSearchParams;
  updateParam: (newParams: Record<string, string | boolean>) => void;
  resetParams: () => void;
}

export const UrlParamsContext = createContext<UrlParamsContextType | undefined>(undefined);

export const UrlParamsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [params, setParams] = useState(searchParams);

  useEffect(() => {
    setParams(searchParams);
  }, [searchParams]);

  const updateParam = (newParams: Record<string, string | boolean>) => {
    const updatedParams = new URLSearchParams(params);
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        updatedParams.set(key, value.toString());
      } else {
        updatedParams.delete(key);
      }
    });
  
    setSearchParams(updatedParams);
  };

  const resetParams = () => {
    const newParams = new URLSearchParams(params);
    Array.from(newParams.keys()).forEach(key => newParams.delete(key));
    setSearchParams(newParams);
  };

  return (
    <UrlParamsContext.Provider value={{ params, updateParam, resetParams }}>
      {children}
    </UrlParamsContext.Provider>
  );
};

export const useUrlParams = (): UrlParamsContextType => {
  const context = useContext(UrlParamsContext);
  if (!context) {
    throw new Error('useUrlParams must be used within a UrlParamsProvider');
  }
  return context;
};
