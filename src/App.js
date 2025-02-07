import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import TextSummarizer2 from "./components/TextSummarizer2";
import SavedTweetsPage from "./pages/SavedTweetsPage";
import Navbar from "./components/Navbar";
import Auth from "./components/Auth";
import { supabase } from "./supabaseClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LandingPage from "./pages/LandingPage";
import SavedLinkedinPage from "./pages/SavedLinkedinPage";
function App() {
  const [user, setUser] = useState(null);
const [showAuth, setShowAuth] = useState(false);  
  useEffect(() => {
    const session = supabase.auth.getSession();
    setUser(session?.user || null);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user);
      if (session?.user) {
        toast.success("Successfully logged in!");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen font-sans bg-gray-50 dark:bg-black">
        <ToastContainer />
        {user ? (
          <>
            <Navbar user={user} onLogout={handleLogout} />
            <Routes>
              <Route path="/app" element={<TextSummarizer2 />} />
              <Route path="/saved-tweets" element={<SavedTweetsPage />} />
              <Route path="/linkedin-saved-posts" element={<SavedLinkedinPage/>} />
              <Route path="*" element={<Navigate to="/app" />} />
            </Routes>
          </>
        ) : (
          <Routes>
            <Route path="/" element={
              <>
                {showAuth ? (
                  <Auth setUser={setUser} />
                ) : (
                  <LandingPage onGetStarted={() => setShowAuth(true)} />
                )}
              </>
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
