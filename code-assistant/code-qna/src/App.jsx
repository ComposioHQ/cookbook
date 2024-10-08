import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import RepostExistingTweet from "./pages/Repost";
import Chat from "./pages/Chat";

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppContent = ({ user, loading }) => {
  const location = useLocation(); // Move this line inside BrowserRouter context

  if (loading) {
    return <SkeletonLoader />
  }

  return (
    <>
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
          <Route path="/repost" element={
            <ProtectedRoute user={user}>
              <RepostExistingTweet user={user} />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={
            <ProtectedRoute user={user}>
              <Chat user={user} />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {location.pathname !== '/chat' && <Footer />} {/* Conditionally render Footer */}
      </SnackbarProvider>
    </>
  );
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

  return (
    <BrowserRouter>
      <AppContent user={user} loading={loading} />
    </BrowserRouter>
  );
}

export default App;