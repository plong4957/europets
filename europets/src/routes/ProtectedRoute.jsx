import { Navigate } from "react-router-dom";
import { auth } from "../firebase/firebase";

function ProtectedRoute({ children }) {
  const user = auth.currentUser;

  return user ? children : <Navigate to="/admin/login" />;
}

export default ProtectedRoute;