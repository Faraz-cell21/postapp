import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: "", content: "" });

  const fetchPosts = async () => {
    try {
      const { data } = await api.get("/post");
      setPosts(data.posts);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLogout = async () => {
    await logout(navigate);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      const { data } = await api.post("/post", form);
      setPosts([data.post, ...posts]);
      setForm({ title: "", content: "" });
    } catch (err) {
      alert("Failed to create post.");
    }
  };

  const handleEdit = (post) => {
    setEditingId(post._id);
    setForm({ title: post.title, content: post.content });
  };

  const handleUpdate = async () => {
    try {
      const { data } = await api.put(`/post/${editingId}`, form);
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p._id === data.updatedPost._id ? data.updatedPost : p
        )
      );
      setEditingId(null);
      setForm({ title: "", content: "" });
    } catch (err) {
      alert("Failed to update post.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/post/${id}`);
      setPosts(posts.filter((p) => p._id !== id));
    } catch (err) {
      alert("Failed to delete post.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-100">
        <p className="text-xl text-gray-700">Loading your posts...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-indigo-700">
            Welcome, {user?.name}
          </h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Logout
          </button>
        </div>

        <div className="mb-10">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            {editingId ? "Edit Post" : "Create New Post"}
          </h3>
          <input
            name="title"
            placeholder="Post title"
            className="w-full border border-gray-300 p-3 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={form.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="content"
            placeholder="Post content"
            className="w-full border border-gray-300 p-3 rounded-lg mb-3 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={form.content}
            onChange={handleChange}
            required
          />
          <button
            onClick={editingId ? handleUpdate : handleCreate}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            {editingId ? "Update" : "Create"}
          </button>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Your Posts
          </h3>
          {posts.length === 0 ? (
            <p className="text-gray-500">No posts found.</p>
          ) : (
            posts.map((post) => (
              <div
                key={post._id}
                className="border border-gray-200 p-5 mb-4 rounded-xl shadow-sm bg-gray-50"
              >
                <h4 className="text-xl font-semibold text-indigo-700">
                  {post.title}
                </h4>
                <p className="text-sm text-gray-700 mt-2 mb-4">
                  {post.content}
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleEdit(post)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1 rounded-lg text-sm transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg text-sm transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
