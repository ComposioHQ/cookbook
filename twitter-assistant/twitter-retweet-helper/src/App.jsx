import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import SkeletonLoader from "./components/SkeletonLoader";
import { SnackbarProvider } from 'notistack'
import CreatePost from "./pages/CreatePost";

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <SkeletonLoader />
  }

  return (
    <BrowserRouter>
      <SnackbarProvider autoHideDuration={3000} preventDuplicate={true} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Navbar user={user} />
        <ScrollToTop />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/Settings" element={
            <ProtectedRoute user={user}>
              <Settings user={user} />
            </ProtectedRoute>
          } />
          <Route path="/createpost" element={
            <ProtectedRoute user={user}>
              <CreatePost user={user} />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </SnackbarProvider>
    </BrowserRouter>
  );
}

export default App;