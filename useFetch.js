import { useState, useEffect } from 'react';

const useFetch = (urlPath) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = process.env.REACT_APP_API_BASE_URL;  // Using environment variable
        if (!baseUrl) {
          throw new Error("API base URL is not defined in environment variables.");
        }
        const response = await fetch(`${baseUrl}${urlPath}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [urlPath]);

  return { data, isLoading, error };
};

export default useFetch;

