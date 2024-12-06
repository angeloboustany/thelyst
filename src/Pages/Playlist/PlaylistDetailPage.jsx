import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth, onAuthStateChanged } from "../../firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "../../firebase";
import axios from "axios";
import { ArrowLeft, X, Play, Plus, Trash } from "lucide-react";

const PlaylistDetailPage = () => {
    const { playlistId } = useParams();
    const [playlist, setPlaylist] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlaylist = async (uid) => {
            setLoading(true);
            const docRef = doc(db, "users", uid, "playlists", playlistId);
            try {
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) setPlaylist(docSnap.data());
            } catch (error) {
                console.error(error);
            }
            setLoading(false);
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) fetchPlaylist(user.uid);
            else navigate("/login");
        });
        return () => unsubscribe();
    }, [playlistId, navigate]);

    const searchTMDB = async () => {
        if (!searchQuery) return;
        setLoading(true);

        try {
            const response = await axios.request({
                method: "GET",
                url: "https://api.themoviedb.org/3/search/multi",
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
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const handleAddToPlaylist = async (item) => {
        try {
            const docRef = doc(db, "users", auth.currentUser.uid, "playlists", playlistId);
            await updateDoc(docRef, {
                items: [...playlist.items, item]
            });
            setPlaylist({ ...playlist, items: [...playlist.items, item] });
        } catch (error) {
            console.error(error);
        }
    };

    const handleRemoveFromPlaylist = async (itemId) => {
        try {
            const docRef = doc(db, "users", auth.currentUser.uid, "playlists", playlistId);
            const updatedItems = playlist.items.filter(item => item.id !== itemId);
            await updateDoc(docRef, { items: updatedItems });
            setPlaylist({ ...playlist, items: updatedItems });
        } catch (error) {
            console.error(error);
        }
    };

    const handleWatch = (item) => {
        const watchUrl = `https://vidsrc.to/embed/${item.media_type}/${item.id}`;
        window.open(watchUrl, "_blank");
    };

    const handleDeletePlaylist = async () => {
        try {
            await deleteDoc(doc(db, "users", auth.currentUser.uid, "playlists", playlistId));
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-black text-gray-200">
            <div className="max-w-5xl mx-auto p-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                </button>

                <h1 className="mt-8 text-2xl font-medium text-center">
                    {playlist?.name || "Loading..."}
                </h1>

                <div className="mt-8 relative">
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
                    {searchQuery && (
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setSearchResults([]);
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {searchResults.length > 0 && (
                    <div className="mt-4 space-y-2 max-h-96 overflow-y-auto bg-gray-900 rounded-lg p-4">
                        {searchResults.map(item => (
                            <div key={item.id} className="flex items-center space-x-4 p-2 hover:bg-gray-800 rounded-lg">
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
                                <button
                                    onClick={() => handleAddToPlaylist(item)}
                                    className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {playlist?.items?.map(item => (
                        <div key={item.id} className="bg-gray-900 rounded-lg overflow-hidden group">
                            <div className="relative">
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                                    alt=""
                                    className="w-full aspect-[2/3] object-cover"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                                    <button
                                        onClick={() => handleWatch(item)}
                                        className="p-2 bg-white/10 hover:bg-white/20 rounded-full"
                                    >
                                        <Play className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleRemoveFromPlaylist(item.id)}
                                        className="p-2 bg-white/10 hover:bg-white/20 rounded-full"
                                    >
                                        <Trash className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-3">
                                <h3 className="text-sm font-medium truncate">
                                    {item.title || item.name}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>

                {playlist?.items?.length === 0 && !loading && (
                    <div className="mt-12 text-center text-gray-400">
                        No items in playlist
                    </div>
                )}

                <button
                    onClick={() => setIsDeleteConfirmOpen(true)}
                    className="mt-12 mx-auto block px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                >
                    Delete Playlist
                </button>

                {isDeleteConfirmOpen && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
                        <div className="bg-gray-900 p-6 rounded-lg max-w-sm w-full mx-4">
                            <h2 className="text-lg font-medium">Delete Playlist?</h2>
                            <p className="mt-2 text-sm text-gray-400">
                                This action cannot be undone.
                            </p>
                            <div className="mt-6 flex space-x-4">
                                <button
                                    onClick={() => setIsDeleteConfirmOpen(false)}
                                    className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeletePlaylist}
                                    className="flex-1 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlaylistDetailPage;