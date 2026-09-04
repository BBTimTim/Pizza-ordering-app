import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import {Provider} from 'react-redux';
import store from './components/redux/store.jsx';
import { ModalProvider } from "./components/context/ModalContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
       <Provider store={store}>
         <ModalProvider>
         <App />
        </ModalProvider>
        </Provider>
  </StrictMode>,
);
