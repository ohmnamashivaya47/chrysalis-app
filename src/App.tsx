import { useState, useEffect } from "react";
import "./App.css";
import { AuthGuard } from "./components/auth/AuthGuard";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import MeditationPage from "./pages/MeditationPage";
import MeditationSessionPage from "./pages/MeditationSessionPage";
import SocialPage from "./pages/SocialPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import QRConnectPage from "./pages/QRConnectPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuth } from "./hooks/useAuth";

// Simple router simulation (in a real app, use React Router)
type Page =
  | "home"
  | "auth"
  | "meditate"
  | "social"
  | "leaderboard"
  | "qr"
  | "profile"
  | "session";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const { isLoading } = useAuth();

  useEffect(() => {
    // Simple routing based on pathname
    const path = window.location.pathname;
    if (path === "/auth") setCurrentPage("auth");
    else if (path === "/meditate") setCurrentPage("meditate");
    else if (path === "/social") setCurrentPage("social");
    else if (path === "/leaderboard") setCurrentPage("leaderboard");
    else if (path === "/qr") setCurrentPage("qr");
    else if (path === "/profile") setCurrentPage("profile");
    else if (path === "/session") setCurrentPage("session");
    else setCurrentPage("home");

    // Listen for navigation events
    const handleNavigation = () => {
      const newPath = window.location.pathname;
      if (newPath === "/auth") setCurrentPage("auth");
      else if (newPath === "/meditate") setCurrentPage("meditate");
      else if (newPath === "/social") setCurrentPage("social");
      else if (newPath === "/leaderboard") setCurrentPage("leaderboard");
      else if (newPath === "/qr") setCurrentPage("qr");
      else if (newPath === "/profile") setCurrentPage("profile");
      else if (newPath === "/session") setCurrentPage("session");
      else setCurrentPage("home");
    };

    window.addEventListener("popstate", handleNavigation);
    return () => window.removeEventListener("popstate", handleNavigation);
  }, []);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 to-white">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto bg-gradient-to-br from-deepTeal to-sage-500 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <p className="text-sage-600">Loading Chrysalis...</p>
        </div>
      </div>
    );
  }

  // Render the appropriate page
  const renderPage = () => {
    switch (currentPage) {
      case "auth":
        return <AuthPage />;

      case "meditate":
        return (
          <AuthGuard>
            <MeditationPage />
          </AuthGuard>
        );

      case "social":
        return (
          <AuthGuard>
            <SocialPage />
          </AuthGuard>
        );

      case "leaderboard":
        return (
          <AuthGuard>
            <LeaderboardPage />
          </AuthGuard>
        );

      case "qr":
        return (
          <AuthGuard>
            <QRConnectPage />
          </AuthGuard>
        );

      case "profile":
        return (
          <AuthGuard>
            <ProfilePage />
          </AuthGuard>
        );

      case "session":
        return (
          <AuthGuard>
            <MeditationSessionPage />
          </AuthGuard>
        );

      default:
        return <HomePage />;
    }
  };

  return <div className="App">{renderPage()}</div>;
}

export default App;
