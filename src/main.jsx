import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import AuthProvider from "./context/AuthProvider"
import { initializeAdmin } from "./utils/adminInit"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Initialize admin user when app starts
initializeAdmin().catch(console.error)

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </AuthProvider>
  </React.StrictMode>
)
