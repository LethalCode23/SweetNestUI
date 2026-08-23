
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { NavBarComponent } from "./components/layout/Navbar/NavBarComponent";
import { FooterComponent } from "./components/layout/Footer/FooterComponent";
import { ProtectedRoute } from "./guards/ProtectedRoute";
import HomePage from "./pages/HomePage";
import CountriesPage from "./pages/CountriesPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import HotelsPage from "./pages/HotelsPage";
import CitiesPage from "./pages/CitiesPage";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import Dashboard from "./components/layout/Dashboard/Dashboard";
import CategoryPage from "./pages/CategoryPage";
import HotelSearchPage from "./pages/HotelSearchPage";
import UserProfilePage from "./pages/UserProfilePage";
import UsersPage from "./pages/UsersPage";
import ProfilesPage from "../src/components/Profile/ProfilesPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import PermissionsPage from "../src/components/PermissionsPage/PermissionsPage";

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
    // Rutas públicas con Navbar
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFoundPage />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "hoteles", element: <HotelSearchPage /> },
      ],
    },

    // Autenticación
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },

    // Panel General Unificado
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
      errorElement: <NotFoundPage />,
      children: [
        {
          path: "hotels",
          element: (
            <ProtectedRoute requiredSubModule="hotels">
              <HotelsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "countries",
          element: (
            <ProtectedRoute requiredSubModule="countries">
              <CountriesPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "departments",
          element: (
            <ProtectedRoute requiredSubModule="departments">
              <DepartmentsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "cities",
          element: (
            <ProtectedRoute requiredSubModule="cities">
              <CitiesPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "categories",
          element: (
            <ProtectedRoute requiredSubModule="categories">
              <CategoryPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "users",
          element: (
            <ProtectedRoute requiredSubModule="users">
              <UsersPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "userProfile",
          element: (
            <ProtectedRoute requiredSubModule="userProfile">
              <UserProfilePage />
            </ProtectedRoute>
          ),
        },
        {
          path: "profiles",
          element: (
            <ProtectedRoute requiredSubModule="profiles">
              <ProfilesPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "profiles/:profileId/permissions",
          element: (
            <ProtectedRoute>
              <PermissionsPage />
            </ProtectedRoute>
          ),
        },
      ],
    },

    // Catch-all: cualquier ruta que no matchee nada de arriba
    { path: "*", element: <NotFoundPage /> }
  ],
  {
    future: { v7_startTransition: true },
  }
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;