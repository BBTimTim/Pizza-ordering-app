import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/pages/Home";
import GuestLayout from "./components/layout/GuestLayout";
import Contact from "./components/pages/Contact";
import Loader from "./components/common/Loader";
import Errorfallback from "./components/common/ErrorFallback.jsx";
import { ErrorBoundary } from "react-error-boundary";
import Profile from "./components/user/Profile.jsx";

const Register = React.lazy(() => import("./components/user/Register"));
const Login = React.lazy(() => import("./components/user/Login"));

const Forgetpassword = React.lazy(() => import("./components/user/Forgetpassword"),);
const Resetpassword = React.lazy(() => import("./components/user/Resetpassword"),);

function App() {
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
              <Route path="/" element={<GuestLayout />}>
                <Route index element={<Home />} />
                <Route path="contact" element={<Contact />}></Route>
                <Route path="register" element={<Register />}></Route>
                <Route path="login" element={<Login />}></Route>
                <Route path="resetpassword" element={<Resetpassword />}></Route>
                <Route path="user/profile" element={<Profile />}></Route>
                <Route
                  path="forgetpassword"
                  element={<Forgetpassword />}
                ></Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

export default App;
