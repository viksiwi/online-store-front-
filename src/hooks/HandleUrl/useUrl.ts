import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function useDebouncedUrlUpdate(delay: number = 1000) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [debouncedParams, setDebouncedParams] = useState(searchParams);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      setSearchParams(debouncedParams);
    }, delay);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [debouncedParams, delay, setSearchParams]);

  const updateUrlParams = (newParams: { [key: string]: string }) => {
    const params = new URLSearchParams(searchParams);
    Object.keys(newParams).forEach((key) => {
      if (newParams[key]) {
        params.set(key, newParams[key]);
      } else {
        params.delete(key);
      }
    });
    setDebouncedParams(params);
  };

  return updateUrlParams;
}

export default useDebouncedUrlUpdate;
