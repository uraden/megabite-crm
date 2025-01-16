import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Protected from './routes/Protected';
import { App as AntdApp } from "antd";
import Main from './pages/Main';
import Categories from './pages/Categories';
import Products from './pages/Products';
import Cart from './pages/Cart';

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Protected>
          <Main />
        </Protected>
      )
    },
    {
      path: "/categories",
      element: (
        <Protected>
          <Categories />
        </Protected>
      )
    },
    {
      path: "/products",
      element: (
        <Protected>
          <Products />
        </Protected>
      )
    },
    {
      path: "/cart",
      element: (
        <Protected>
          <Cart />
        </Protected>
      )
    },
    {
      path: "*",
      element: (
          <h1>404</h1>
      )
    }
  ]);

  return (
    <>
       <AntdApp>
      <RouterProvider router={router} />
      </AntdApp>
    </>
  )
}

export default App
