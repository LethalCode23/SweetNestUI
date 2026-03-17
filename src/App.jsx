import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { NavBarComponent } from "./components/NavBarComponent";
import { FooterComponent } from "./components/FooterComponent";
import HomePage from "./pages/HomePage";
import CountriesPage from "./pages/CountriesPage";
import CartPage from "./pages/CartPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import HotelsPage from "./pages/HotelsPage";
import CitiesPage from "./pages/CitiesPage";

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
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "countries", element: <CountriesPage /> },
        { path: "departments", element: <DepartmentsPage /> },
        { path: "cart", element: <CartPage /> },
        { path: "hotels", element: <HotelsPage /> },
        { path: "cities", element: <CitiesPage /> },
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
