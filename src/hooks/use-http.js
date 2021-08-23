import { useState, useCallback } from "react";

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState();
  const [isLoadingForSignupLogin, setIsLoadingForSignupLogin] = useState(false);

  const sendRequest = useCallback(async (requestConfig, applyData) => {
    try {
      setIsLoadingForSignupLogin(true);
      const response = await fetch(requestConfig.url, {
        method: requestConfig.method ? requestConfig.method : "GET",
        headers: requestConfig.headers ? requestConfig.headers : {},
        body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const responseData = await response.json();
      applyData(responseData);
    } catch (e) {
      setHttpError(e.message || e.error.code || "Something went wrong");
    }
    setIsLoadingForSignupLogin(false);
    setIsLoading(false);
  }, []);

  return { isLoading, isLoadingForSignupLogin, httpError, sendRequest };
};

export default useHttp;
