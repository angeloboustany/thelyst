import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/Auth/LoginPage";
import HomePage from "./Pages/Home/HomePage";
import PrivateRoute from "./Components/PrivateRoute";
import CreatePlaylistPage from "./Pages/Playlist/CreatePlaylistPage";
import PlaylistDetailPage from "./Pages/Playlist/PlaylistDetailPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route path="/create-playlist" element={<CreatePlaylistPage />} />
        <Route path="/playlist/:playlistId" element={<PlaylistDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
