import React, { useState } from "react";
import { collection, addDoc, db, auth } from "../../firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X, Plus, Loader2 } from "lucide-react";

const CreatePlaylistPage = () => {
    const navigate = useNavigate();
    const [playlistName, setPlaylistName] = useState("");
    const [playlistDescription, setPlaylistDescription] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const searchTMDB = async () => {
        if (!searchQuery) return;
        setLoading(true);
        setError("");

        try {
            const response = await axios.get("https://api.themoviedb.org/3/search/multi", {
                params: {
                    query: searchQuery,
                    include_adult: "false",
                    language: "en-US",
                    page: "1",
                },
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_TMDB_TOKEN}`,
                },
            });
            setSearchResults(response.data.results.filter(
                item => item.media_type === "movie" || item.media_type === "tv"
            ));
        } catch (err) {
            setError("Search failed");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!playlistName.trim()) {
            setError("Please enter a playlist name");
            return;
        }

        try {
            await addDoc(collection(db, "users", auth.currentUser.uid, "playlists"), {
                name: playlistName.trim(),
                description: playlistDescription.trim(),
                items: selectedItems,
            });
            navigate("/");
        } catch (error) {
            setError("Failed to create playlist");
        }
    };

    return (
        <div className="min-h-screen bg-black text-gray-200">
            <div className="max-w-2xl mx-auto p-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                </button>

                <h1 className="mt-8 text-2xl font-medium">Create Playlist</h1>

                <div className="mt-8 space-y-6">
                    <input
                        type="text"
                        placeholder="Playlist name"
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e.target.value)}
                        className="w-full bg-gray-900 border-0 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-1 focus:ring-gray-700"
                    />

                    <textarea
                        placeholder="Description (optional)"
                        value={playlistDescription}
                        onChange={(e) => setPlaylistDescription(e.target.value)}
                        className="w-full bg-gray-900 border-0 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-1 focus:ring-gray-700 min-h-[100px] resize-none"
                    />

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search movies & shows"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                searchTMDB();
                            }}
                            className="w-full bg-gray-900 border-0 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-1 focus:ring-gray-700"
                        />
                        {loading && (
                            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-gray-400" />
                        )}
                    </div>

                    {searchResults.length > 0 && (
                        <div className="space-y-2 max-h-96 overflow-y-auto bg-gray-900 rounded-lg p-4">
                            {searchResults.map(item => (
                                <div
                                    key={item.id}
                                    onClick={() => {
                                        setSelectedItems(prev => [...prev, item]);
                                        setSearchQuery("");
                                        setSearchResults([]);
                                    }}
                                    className="flex items-center space-x-4 p-2 hover:bg-gray-800 rounded-lg cursor-pointer"
                                >
                                    <img
                                        src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                                        alt=""
                                        className="w-12 h-16 object-cover rounded"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-medium truncate">
                                            {item.title || item.name}
                                        </h3>
                                        <p className="text-xs text-gray-400 truncate">
                                            {item.release_date || item.first_air_date}
                                        </p>
                                    </div>
                                    <Plus className="w-5 h-5 text-gray-400" />
                                </div>
                            ))}
                        </div>
                    )}

                    {selectedItems.length > 0 && (
                        <div className="space-y-3">
                            <h2 className="text-sm font-medium text-gray-400">
                                Selected ({selectedItems.length})
                            </h2>
                            <div className="grid grid-cols-2 gap-3">
                                {selectedItems.map(item => (
                                    <div
                                        key={item.id}
                                        className="bg-gray-900 rounded-lg overflow-hidden group"
                                    >
                                        <div className="relative">
                                            <img
                                                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                                                alt=""
                                                className="w-full aspect-[2/3] object-cover"
                                            />
                                            <button
                                                onClick={() => setSelectedItems(prev =>
                                                    prev.filter(i => i.id !== item.id)
                                                )}
                                                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="p-2">
                                            <h3 className="text-sm truncate">
                                                {item.title || item.name}
                                            </h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={!playlistName.trim()}
                        className="w-full px-4 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Create Playlist
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatePlaylistPage;