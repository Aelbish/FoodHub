import React, { useState, useEffect, useCallback } from "react";

let logoutTimer;

const AuthContext = React.createContext({
  token: "",
  username: "",
  email: "",
  isLoggedIn: false,
  login: (token, username, email, expirationTime) => {},
  logout: () => {},
  reloader: false,
});

const calculateRemaningTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjustedExpirationTime = new Date(expirationTime).getTime();
  const remainingTime = adjustedExpirationTime - currentTime;
  return remainingTime;
};

const retrievedToken = () => {
  const storedToken = localStorage.getItem("token");
  const storedUsername = localStorage.getItem("username");
  const storedEmail = localStorage.getItem("email");
  const storedExpirationDate = localStorage.getItem("expirationTime");
  const remainingTime = calculateRemaningTime(storedExpirationDate);

  if (remainingTime <= 6000) {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("expirationTime");
    return null;
  }

  return {
    token: storedToken,
    username: storedUsername,
    email: storedEmail,
    duration: remainingTime,
  };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrievedToken();
  let initialToken;
  let initialUsername;
  let initialEmail;
  if (tokenData) {
    initialToken = tokenData.token;
    initialUsername = tokenData.username;
    initialEmail = tokenData.email;
  }

  const [token, setToken] = useState(initialToken);
  const [username, setUsername] = useState(initialUsername);
  const [email, setEmail] = useState(initialEmail);

  const userIsLoggedIn = !!token;

  let shouldReload = false;

  const logoutHandler = useCallback(() => {
    setToken(null);
    setUsername("");
    setEmail("");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("expirationTime");

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = (token, username, email, expirationTime) => {
    setToken(token);
    setUsername(username);
    setEmail(email);
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
    localStorage.setItem("expirationTime", expirationTime);
    const remainingDuration = calculateRemaningTime(expirationTime);
    logoutTimer = setTimeout(logoutHandler, remainingDuration);
  };

  useEffect(() => {
    if (tokenData) {
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  const contextValue = {
    token: token,
    username: username,
    email: email,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    reloader: shouldReload,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
