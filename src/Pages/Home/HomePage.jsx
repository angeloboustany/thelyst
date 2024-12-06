import React, { useEffect, useState } from "react";
import { auth, signOut } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import PlaylistGrid from "../../Components/PlaylistGrid";

const HomePage = () => {
  const [playlists, setPlaylists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylists = async () => {
      const userId = auth.currentUser.uid;
      const userPlaylistsRef = collection(db, "users", userId, "playlists");
      try {
        const querySnapshot = await getDocs(userPlaylistsRef);
        const fetchedPlaylists = [];
        querySnapshot.forEach((doc) => {
          fetchedPlaylists.push({ id: doc.id, ...doc.data() });
        });
        setPlaylists(fetchedPlaylists);
      } catch (error) {
        console.error("Error fetching playlists: ", error);
      }
    };

    if (auth.currentUser) {
      fetchPlaylists();
    }
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  const handleCreatePlaylistClick = () => {
    navigate("/create-playlist");
  };

  return (
    <div className="bg-black min-h-screen text-white p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold text-white">TheLyst</h1>
        <button
          onClick={handleLogout}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Create Playlist Button */}
      <div className="flex justify-center mb-12">
        <button
          onClick={handleCreatePlaylistClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg transition-colors"
        >
          Create Playlist
        </button>
      </div>

      {/* Playlist Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Your Playlists</h2>
        {playlists.length === 0 ? (
          <p className="text-gray-400 text-center">You haven't created any playlists yet.</p>
        ) : (
          <PlaylistGrid playlists={playlists} />
        )}
      </div>
    </div>
  );
};

export default HomePage;