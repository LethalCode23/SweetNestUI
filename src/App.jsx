import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { NavBarComponent } from "./components/layout/Navbar/NavBarComponent";
import { FooterComponent } from "./components/layout/Footer/FooterComponent";
import HomePage from "./pages/HomePage";
import CountriesPage from "./pages/CountriesPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import HotelsPage from "./pages/HotelsPage";
import CitiesPage from "./pages/CitiesPage";
import LoginPage from "./pages/Auth/LoginPage";
import AdminDashboard from "./components/layout/Dashboard/Dashboard";

const Layout = () => (
  <>
    <NavBarComponent />
    <main>
      <Outlet />
    </main>
    <FooterComponent />
  </>
);

const router = createBrowserRouter(
  [

    // Rutas públicas CON navbar
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <HomePage /> },
      ],
    },

    // Login y Register sin navbar
    { path: "/login",    element: <LoginPage /> },
    // { path: "/register", element: <RegisterPage /> },

    {
      path: "/admin",
      element: <AdminDashboard />,
      children: [
        { path: "hotels",      element: <HotelsPage /> },
        { path: "countries",   element: <CountriesPage /> },
        { path: "departments", element: <DepartmentsPage /> },
        { path: "cities",      element: <CitiesPage /> },
      ],
    },
  ],
  {
    future: { v7_startTransition: true },
  }
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;