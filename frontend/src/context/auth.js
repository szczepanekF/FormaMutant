import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { login, is_auth, refresh, logout, getIsAdmin } from "../endpoints/api";
import { toast } from "sonner";
import ToastNotification from "../components/toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(false);

  const [userName, setUserName] = useState("");
  const [admin, setADmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();
  const [navigatingToLogin, setNavigatingToLogin] = useState(false);
  const [toastConfig, setToastConfig] = useState({
    show: false,
    variant: "success",
    message: "",
  });
  const showToast = (variant, message) => {
    setToastConfig({
      show: true,
      variant,
      message,
    });
  };

  const withRefresh = async (fn, onFail) => {
    try {
      await fn();
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        try {
          await refresh();
          await fn();
        } catch (refreshError) {
          if (
            refreshError.response?.status === 401 ||
            refreshError.response?.status === 400
          ) {
            // console.error("Nie udało się odświeżyć tokena", refreshError);
            setUser(false);
            showToast("error", "Twoja sesja wygasła. Zaloguj się ponownie.");
            setNavigatingToLogin(true);
            nav("/login");
          } else {
            showToast(
              "error",
              error?.response?.data?.reason
                ? `${error.response.data.reason}.`
                : "Wystąpił błąd."
            );
          }
          onFail?.();
        }
      } else {
        showToast(
          "error",
          error?.response?.data?.reason
            ? `${error.response.data.reason}.`
            : "Wystąpił błąd."
        );

        onFail?.();
        console.log(error);
      }
    }
  };

  const withErrorHandler = async (fn, onFail) => {
    try {
      await fn();
    } catch (error) {
      if (error?.response?.data?.reason) {
        const errorString = error.response.data.reason;
        const match = errorString.match(
          /ErrorDetail\(string='(.*?)', code='(.*?)'\)/
        );
        if (match && match[1]) {
          const message = match[1];
          showToast("error", message + ".");
        } else {
          showToast("error", errorString + ".");
        }
      } else if (error?.message) {
        showToast("error", error.message + ".");
      } else {
        showToast("error", "Wystąpił nieznany błąd.");
      }
      onFail?.();
      console.log(error);
    }
  };

  const get_authenticated = async () => {
    await withRefresh(
      async () => {
        const response = await is_auth();
        const isAdmin = await getIsAdmin();
        setADmin(isAdmin);
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
        console.log("error");
      }
    );
  };

  const loginUser = async (username, password) => {
    try {
      const info = await login(username, password);
      setUser(info);
      const isAdmin = await getIsAdmin();
      setADmin(isAdmin);
      setNavigatingToLogin(false);
      nav("/admin");
    } catch (error) {
      showToast("error", "Nieprawidłowe dane logowania");
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
      {toastConfig.show && (
        <ToastNotification
          variant={toastConfig.variant}
          message={toastConfig.message}
          open={toastConfig.show}
          onClose={() => setToastConfig((prev) => ({ ...prev, show: false }))}
        />
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
