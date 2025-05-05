import { User } from "@/types/user";
import { createContext, useContext } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { login, logout } from "../store/authSlice";

interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
  signIn: (user: User) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const signIn = (user: User) => {
    dispatch(login(user));
  };

  const signOut = () => {
    dispatch(logout());
  };

  return (
    <AuthContext.Provider
      value={{
        user: auth.user!,
        isAuthenticated: auth.isAuthenticated,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
