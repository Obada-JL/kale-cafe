import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
// import "./navBar.css";
import PageLayout from "./PageLayout";
import MainPage from "./components/MainPage";
import ProductsPageLayout from "./components/ProductsPageLayout";
import ProductCategory from "./components/ProductCategory";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ErrorBoundary>
          <PageLayout />
        </ErrorBoundary>
      ),
      children: [
        {
          path: "/",
          element: (
            <ErrorBoundary>
              <MainPage />
            </ErrorBoundary>
          ),
        },
        {
          path: "/",
          element: <ProductsPageLayout />,
          children: [
            {
              path: ":category",
              element: (
                <ErrorBoundary>
                  <ProductCategory />
                </ErrorBoundary>
              ),
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
