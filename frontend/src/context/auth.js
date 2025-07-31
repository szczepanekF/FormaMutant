import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { login, is_auth, refresh, logout, getIsAdmin } from "../endpoints/api";
import { toast } from "sonner";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(false);

  const [userName, setUserName] = useState("");
  const [admin, setADmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();
  const [navigatingToLogin, setNavigatingToLogin] = useState(false);

  const withRefresh = async (fn, onFail) => {
    try {
      await fn();
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          await refresh();
          await fn();
        } catch (refreshError) {
          if (
            refreshError.response?.status === 401 ||
            refreshError.response?.status == 400
          ) {
            // console.error("Nie udało się odświeżyć tokena", refreshError);
            setUser(false);
            toast.error("Twoja sesja wygasła. Zaloguj się ponownie.");
            setNavigatingToLogin(true);
            nav("/login");
          } else {
            toast.error(
              refreshError.response?.data?.reason + "." || "Wystąpił błąd."
            );
          }
          onFail?.();
        }
      } else {
        toast.error(error.response?.data?.reason + "." || "Wystąpił błąd.");

        onFail?.();
      }
    }
  };

  const withErrorHandler = async (fn, onFail) => {
    try {
      await fn();
    } catch (error) {
      if (error?.response?.data?.reason) {
        const errorString = error?.response?.data?.reason;
        const message = errorString.match(
          /ErrorDetail\(string='(.*?)', code='(.*?)'\)/
        )[1];
        toast.error(message + ".");
      } else if (error?.message) {
        toast.error(error.message + ".");
      } else {
        toast.error("Wystąpił nieznany błąd.");
      }
      console.log(error);
      onFail?.();
    }
  };

  const get_authenticated = async () => {
    await withRefresh(
      async () => {
        console.log("BBBBBBBBB");
        const response = await is_auth();
        const isAdmin = await getIsAdmin();
        setADmin(isAdmin);
        console.log("true_auth");
        setUser(true);
        if (response.data.first_name === "") {
          setUserName("Admin");
        } else {
          setUserName(`${response.data.first_name} ${response.data.last_name}`);
        }
        setLoading(false);
      },
      () => {
        setNavigatingToLogin(true);
        nav("/login");
        setUser(false);
        setLoading(false);
      }
    );
  };

  // const get_authenticated = async () => {
  //   try {
  //     const response = await is_auth();
  //     const isAdmin = await getIsAdmin();
  //     setADmin(isAdmin);
  //     console.log("true_auth");
  //     setUser(true);
  //     if (response.data.first_name === "") {
  //       setUserName("Admin");
  //     } else {
  //       setUserName(`${response.data.first_name} ${response.data.last_name}`);
  //     }
  //   } catch (error) {
  //     try {
  //       await refresh();
  //       const response = await is_auth();
  //       const isAdmin = await getIsAdmin();
  //       setADmin(isAdmin);
  //       console.log("true_refresh");
  //       setUser(true);
  //       if (response.data.first_name === "") {
  //         setUserName("Admin");
  //       } else {
  //         setUserName(`${response.data.first_name} ${response.data.last_name}`);
  //       }
  //     } catch {
  //       console.log("false");
  //       setNavigatingToLogin(true);
  //       nav("/login");
  //       setUser(false);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const loginUser = async (username, password) => {
    try {
      console.log("proba");
      const info = await login(username, password);
      console.log("Udalo sie");
      setUser(info);
      const isAdmin = await getIsAdmin();
      setADmin(isAdmin);
      setNavigatingToLogin(false);
      nav("/admin");
    } catch (error) {
      toast.error("Bad credentials");
    }
  };
  const deleteUser = async () => {
    setUser(false);
  };

  const logoutUser = async () => {
    try {
      await logout();
      setUser(false);
      setNavigatingToLogin(true);
      nav("/menu");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        try {
          await refresh();
          await logout();
          setUser(false);
          setNavigatingToLogin(true);
          nav("/login");
        } catch (refreshError) {}
      } else {
      }
    }
  };

  // useEffect(() => {
  //   get_authenticated();
  // }, [window.location.pathname]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        navigatingToLogin,
        setNavigatingToLogin,
        loginUser,
        refresh,
        withErrorHandler,
        logoutUser,
        get_authenticated,
        admin,
        userName,
        deleteUser,
        withRefresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
