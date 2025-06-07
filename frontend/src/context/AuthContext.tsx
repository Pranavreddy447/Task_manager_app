import React, { createContext, useContext, useState, useEffect } from 'react';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
};

type AuthContextType = {
  authState: AuthState;
  setAuthState: (data: AuthState) => void;
  loading: boolean;
  login: (access: string, refresh: string) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    accessToken: null,
    refreshToken: null,
  });

  const [loading, setLoading] = useState(true); // <-- Add loading state

  useEffect(() => {
    const access = localStorage.getItem('accessToken');
    const refresh = localStorage.getItem('refreshToken');
    if (access && refresh) {
      setAuthState({ accessToken: access, refreshToken: refresh });
    }
    setLoading(false); // <-- Set to false after reading
  }, []);

  const login = (access: string, refresh: string) => {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    setAuthState({ accessToken: access, refreshToken: refresh });
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAuthState({ accessToken: null, refreshToken: null });
  };

  const refreshAccessToken = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/auth/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: authState.refreshToken }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('accessToken', data.access);
        setAuthState((prev) => ({ ...prev, accessToken: data.access }));
      } else {
        logout();
      }
    } catch (err) {
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ authState, setAuthState, login, logout, refreshAccessToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
