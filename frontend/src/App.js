import logo from "./logo.svg";
import { ChakraProvider, Stack, Flex } from "@chakra-ui/react";
import "./App.css";
import Menu from "./routes/main_site";
import Admin from "./routes/admin_site_orders";
import AdminPanel from "./routes/admin_panel";
import AdminItems from "./routes/admin_site_items";
import { AuthProvider } from "./context/auth";
import Login from "./routes/login";
import Order from "./routes/order_site";
import Rodo from "./routes/rodo_site";
import Rules from "./routes/rules";
import Navbar from "./components/navbar";
import Menu2 from "./routes/main_site_copy";
import NotFound from "./routes/null_site";
import theme from "./assets/theme";
import { Toaster } from "sonner";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Outlet,
} from "react-router-dom";
import ProtectedRoute from "./routes/protected_route";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Toaster richColors closeButton position="top-center" />
      <Router>
        <AuthProvider>
          <Routes>
            <Route
              element={
                <Flex direction="column" minH="100vh">
                  {/* <Navbar /> */}
                  <Flex flex="1">
                    <Outlet />
                  </Flex>
                </Flex>
              }
            >
              <Route path="/menu" element={<Menu />}></Route>
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              ></Route>
              <Route path="/login" element={<Login />}></Route>
              <Route path="/order" element={<Order />}></Route>
              <Route path="/rodo" element={<Rodo />}></Route>
              <Route path="/rules" element={<Rules />}></Route>
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
}

export default App;
