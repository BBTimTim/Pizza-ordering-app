import React, { Suspense, useContext } from "react";
import { Routes, Route } from "react-router-dom";
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
import ConfirmationModal from "./components/common/ConfirmationModal.jsx";
import { ModalContext } from "./components/context/ModalContext";

const Register = React.lazy(() => import("./components/user/Register"));
const Login = React.lazy(() => import("./components/user/Login"));
const ASZF = React.lazy(() => import("./components/pages/ASZF.jsx"),);
const Privacy = React.lazy(() => import("./components/pages/Privacy.jsx"),);
const About = React.lazy(() => import("./components/pages/About.jsx"),);

const Forgetpassword = React.lazy(() => import("./components/user/Forgetpassword"),);
const Resetpassword = React.lazy(() => import("./components/user/Resetpassword"),);
const Profile = React.lazy(() => import("./components/user/Profile"),);
const UserProducts = React.lazy(() => import("./components/products/Products.jsx"),);
const Cart = React.lazy(() => import("./components/cart/Cart.jsx"),);
const Contact = React.lazy(() => import("./components/pages/Contact"),);
const AddOrder = React.lazy(() => import("./components/order/AddOrder.jsx"),);

const AddProducts = React.lazy(() => import("./components/admin/AddProducts.jsx"),);
const AddSizes = React.lazy(() => import("./components/admin/AddSizes.jsx"),);
const AddToppings = React.lazy(() => import("./components/admin/AddToppings.jsx"),);
const Toppings = React.lazy(() => import("./components/admin/Toppings.jsx"),);
const Sizes = React.lazy(() => import("./components/admin/Sizes.jsx"),);
const AdminProfile = React.lazy(() => import("./components/admin/Profile"),);

const AdminOrders = React.lazy(() => import("./components/admin/Orders.jsx"),);
const AdminProducts = React.lazy(() => import("./components/admin/Products.jsx"),);
const Editproduct = React.lazy(() => import("./components/admin/Editproduct.jsx"),);
const AminLayout = React.lazy(() => import("./components/admin/Layout.jsx"),);

function App() {

 const user = useSelector(selectCurrentUser);
 const {open, handleLogout, handleCart, modalType} = useContext(ModalContext);

  const logErrorService = (error, errorInfo) => {
    console.log({error, errorInfo})
  }

  const cart = useSelector((state) => state.cart);
  const cartItems = cart.items;

  return (
    <>
      <ErrorBoundary 
      FallbackComponent={Errorfallback}
      onError={(error, errorInfo) => logErrorService(error, errorInfo)}
      >
        <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                   <Route path="aszf" element={<ASZF />} />
                    <Route path="about" element={<About />} />
                   <Route path="privacy" element={<Privacy />} />
                    <Route path="contact" element={<Contact />}></Route>
                    <Route path="register" element={user ? <Home /> : <Register />} />
                    <Route path="login" element={user ? <Home /> : <Login />} />
                    <Route path="resetpassword" element={<Resetpassword />}></Route>
                    <Route path="cart" element={<Cart />}></Route>
                    <Route path="products" element={<UserProducts />}></Route>
                    <Route path="forgetpassword" element={<Forgetpassword />}></Route>
                    <Route path="addorder" element={<AddOrder />}></Route>
                    <Route element={<ProtectedRoutes />}>
                      <Route path="user/profile" element={<Profile />} />
                    </Route>
                </Route>
              
                   <Route element={<AdminRoutes />}>
                      <Route path="admin" element={<AminLayout />}>
                        <Route path="orders" element={<AdminOrders />} />
                        <Route path="addproducts" element={<AddProducts />} />
                        <Route path="addtoppings" element={<AddToppings />} />
                        <Route path="addsizes" element={<AddSizes />} />
                        <Route path="sizes" element={<Sizes />} />
                        <Route path="profile" element={<AdminProfile />} />
                        <Route path="toppings" element={<Toppings />} />
                         <Route path="products" element={<AdminProducts />} />
                          <Route path="editproduct/:id" element={<Editproduct />} />
                       </Route> 
                  </Route>
              </Routes>
              {open &&  <Modal onConfirm={handleLogout}>Biztosan kijelentkezel?</Modal>}
              {open && modalType === "confirmation" && cartItems.length > 0 && <ConfirmationModal onConfirm={handleCart}>Vásárlás folytatása vagy megrendelés leadása?</ConfirmationModal>}
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

export default App;
