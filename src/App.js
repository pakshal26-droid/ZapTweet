import React, { useState, useEffect } from "react";
import TextSummarizer2 from "./components/TextSummarizer2";
import ThemeToggle from "./components/ThemeToggle";
import Auth from "./components/Auth";
import { supabase } from "./supabaseClient";
import AnalysisOutput from "./components/AnalysisOutput";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [user, setUser] = useState(null);

  // Check user session on mount
  useEffect(() => {
    const session = supabase.auth.getSession();
    setUser(session?.user || null);

    // Listen for changes in authentication state
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

  const getGreetingMessage = () => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      return "Good morning";
    } else if (currentHour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };

  const greetingMessage = getGreetingMessage();
  return (
    <div className="min-h-screen font-newsreader bg-gradient-to-b from-white to-gray-200 dark:from-black dark:to-gray-800">
      <ToastContainer />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-full mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-5xl font-newsreader font-bold text-gray-900 dark:text-white">
              ZapTweet
            </h1>
            <ThemeToggle />
          </div>

          {user ? (
            <div>
              <h2 className="text-2xl dark:text-white font-medium mb-5">
                {greetingMessage}, {user.user_metadata.name}!
              </h2>

              <TextSummarizer2 />

              <button
                onClick={handleLogout}
                className="mt-4 w-48 bg-red-600 text-white p-2 rounded-lg"
              >
                Logout
              </button>
            </div>
          ) : (
            <Auth setUser={setUser} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
