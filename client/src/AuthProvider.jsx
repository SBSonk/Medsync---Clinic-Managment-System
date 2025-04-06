import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [access_token, SetAccessToken] = useState(
    localStorage.getItem("access_token")
  );
  const [role, SetRole] = useState(localStorage.getItem("role"));
  const [userID, SetUserID] = useState(localStorage.getItem("user_id"));

  useEffect(() => {
    if (access_token) {
      localStorage.setItem("access_token", access_token);
    }
    if (role) {
      localStorage.setItem("role", role);
    }
    if (userID) {
      localStorage.setItem("user_id", userID);
    }
  }, [access_token, role, userID]);

  return (
    <AuthContext.Provider
      value={{ access_token, role, userID, SetUserID, SetAccessToken, SetRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
