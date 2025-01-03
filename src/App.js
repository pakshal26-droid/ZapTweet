import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import TextSummarizer2 from "./components/TextSummarizer2";
import SavedTweetsPage from "./pages/SavedTweetsPage";
import Navbar from "./components/Navbar";
import Auth from "./components/Auth";
import { supabase } from "./supabaseClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [user, setUser] = useState(null);

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
      <div className="min-h-screen font-newsreader bg-gradient-to-b from-white to-gray-200 dark:from-black dark:to-gray-800">
        <ToastContainer />
        
        
        {user ? (
          <>
            <Navbar user={user} onLogout={handleLogout} />
            <Routes>
              <Route path="/" element={<TextSummarizer2 />} />
              <Route path="/saved-tweets" element={<SavedTweetsPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </>
        ) : (
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-full mx-auto">
              <h1 className="text-5xl font-newsreader font-bold text-gray-900 dark:text-white mb-6">
                ZapTweet
              </h1>
              <Auth setUser={setUser} />
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
