import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { NavBarComponent } from "./components/NavBarComponent";
import HomePage from "./pages/HomePage";
import CountriesPage from "./pages/CountriesPage";
import CartPage from "./pages/CartPage";
import DepartmentsPage from "./pages/DepartmentsPage";

const Layout = () => (
  <>
    <NavBarComponent />
    <main>
      <Outlet />
    </main>
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
