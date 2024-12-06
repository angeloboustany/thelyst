import React from "react";
import { useNavigate } from "react-router-dom";

const PlaylistGrid = ({ playlists }) => {
  const navigate = useNavigate();
  const handlePlaylistClick = (playlistId) => {
    navigate(`/playlist/${playlistId}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {playlists.length > 0 ? (
        playlists.map((playlist) => (
          <div
            key={playlist.id}
            onClick={() => handlePlaylistClick(playlist.id)}
            className="bg-gray-900 rounded-lg p-3 cursor-pointer hover:bg-gray-800 transition-colors"
          >
            <h3 className="text-lg font-semibold text-white mb-1">{playlist.name}</h3>
            <p className="text-gray-400 text-sm mb-2">{playlist.description}</p>
            <div className="flex space-x-1">
              {playlist.items.slice(0, 7).map((item) => (
                <img
                  key={item.id}
                  src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                  alt={item.title || item.name}
                  className="w-12 h-18 object-cover rounded-sm"
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-center col-span-full">No playlists found.</p>
      )}
    </div>
  );
};

export default PlaylistGrid;