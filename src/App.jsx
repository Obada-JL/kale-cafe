import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
// import "./navBar.css";
import PageLayout from "./PageLayout";
import MainPage from "./components/MainPage";
import ProductsPageLayout from "./components/ProductsPageLayout";
import DrinksPage from "./components/DrinksPage";
import ProductCategory from "./components/ProductCategory";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <PageLayout />,
      children: [
        { path: "/", element: <MainPage /> },
        {
          path: "/",
          element: <ProductsPageLayout />,
          children: [{ path: ":category", element: <ProductCategory /> }],
        },
      ],
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
