import React, { Suspense, useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/pages/Home";
import Layout from "./components/layout/Layout.jsx";
import Loader from "./components/common/Loader";
import Errorfallback from "./components/common/ErrorFallback.jsx";
import AdminRoutes from "./components/routes/AdminRoutes.jsx";
import ProtectedRoutes from "./components/routes/ProtectedRoutes.jsx";

import { ErrorBoundary } from "react-error-boundary";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "./components/redux/auth/authSlice.js";
import Modal from "./components/common/Modal.jsx";
import { ModalContext } from "./components/context/ModalContext.jsx";

const Register = React.lazy(() => import("./components/user/Register"));
const Login = React.lazy(() => import("./components/user/Login"));

const Forgetpassword = React.lazy(() => import("./components/user/Forgetpassword"),);
const Resetpassword = React.lazy(() => import("./components/user/Resetpassword"),);
const Profile = React.lazy(() => import("./components/user/Profile"),);
//const UserProducts = React.lazy(() => import("./components/products/Products.jsx"),);
//const Cart = React.lazy(() => import("./components/cart/Cart.jsx"),);
const Contact = React.lazy(() => import("./components/pages/Contact"),);

const AddProducts = React.lazy(() => import("./components/admin/AddProducts.jsx"),);
const AdminProducts = React.lazy(() => import("./components/admin/Products.jsx"),);
const AminLayout = React.lazy(() => import("./components/admin/Layout.jsx"),);

function App() {

 const user = useSelector(selectCurrentUser);
 const {open, handleLogout} = useContext(ModalContext);

  const logErrorService = (error, errorInfo) => {
    console.log({error, errorInfo})
  }
  return (
    <>
      <ErrorBoundary 
      FallbackComponent={Errorfallback}
      onError={(error, errorInfo) => logErrorService(error, errorInfo)}
      >
        <Suspense fallback={<Loader />}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                    <Route path="contact" element={<Contact />}></Route>
                    <Route path="register" element={user ? <Home /> : <Register />} />
                    <Route path="login" element={user ? <Home /> : <Login />} />
                    <Route path="resetpassword" element={<Resetpassword />}></Route>
                    {/* <Route path="cart" element={<Cart />}></Route>
                    <Route path="products" element={<Products />}></Route> */}
                    <Route path="forgetpassword" element={<Forgetpassword />}></Route>
                    <Route element={<ProtectedRoutes />}>
                      <Route path="user/profile" element={<Profile />} />
                    </Route>
                </Route>
              
                   <Route element={<AdminRoutes />}>
                      <Route path="admin" element={<AminLayout />}>
                        <Route path="addproducts" element={<AddProducts />} />
                         <Route path="products" element={<AdminProducts />} />
                   
                       </Route>
                  </Route>
              </Routes>
              {open && <Modal onConfirm={handleLogout}>Biztosan kijelentkezel?</Modal>}
          </BrowserRouter>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

export default App;
