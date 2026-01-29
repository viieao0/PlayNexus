import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Safe JSON parse (prevents JSON.parse(undefined/null))
  const safeParse = (value) => {
    try {
      if (!value) return null;
      return JSON.parse(value);
    } catch (err) {
      return null;
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token") || "";
    const savedUser = safeParse(localStorage.getItem("user"));

    setToken(savedToken);
    setUser(savedUser);
    setLoading(false);
  }, []);

  // ✅ this is what Login.jsx will use
  const setAuth = ({ token, user }) => {
    setToken(token || "");
    setUser(user || null);

    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");

    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  };

  // ✅ keep login for convenience (same logic)
  const login = (access_token, userData) => {
    setAuth({ token: access_token, user: userData });
  };

  const logout = () => {
    setAuth({ token: "", user: null });
  };

  const isLoggedIn = !!token;
  const role = user?.role || null;
  const isCompany = role === "company";
  const isYoutuber = role === "youtuber";

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        role,
        isLoggedIn,
        isCompany,
        isYoutuber,

        // ✅ actions
        setAuth,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
