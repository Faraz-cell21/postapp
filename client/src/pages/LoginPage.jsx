import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage() {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "", general: "" });
  const [showPassword, setShowPassword] = useState(false); // 👈 show/hide toggle

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const validate = () => {
    let valid = true;
    const newErrors = { email: "", password: "", general: "" };

    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Email is not valid.";
      valid = false;
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required.";
      valid = false;
    } else if (form.password.length < 8 || form.password.length > 15) {
      newErrors.password = "Password must be 8-15 characters long.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "", general: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const res = await login(form.email, form.password);
    if (res.success) {
      navigate("/dashboard");
    } else {
      if (res.message === "User not registered") {
        setErrors((prev) => ({ ...prev, general: "User not registered." }));
      } else {
        setErrors((prev) => ({ ...prev, general: "Login failed. Try again." }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-lg rounded-2xl px-8 py-10"
      >
        <h2 className="text-3xl font-bold text-indigo-600 text-center mb-6">Login</h2>

        {errors.general && (
          <p className="text-red-600 text-sm mb-4 text-center">{errors.general}</p>
        )}

        {/* Email */}
        <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
        <input
          name="email"
          placeholder="Enter your email"
          className="w-full border border-gray-300 p-3 rounded-lg mb-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-3">{errors.email}</p>
        )}

        {/* Password */}
        <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"} // 👈 toggle here
            placeholder="Enter your password"
            className="w-full border border-gray-300 p-3 rounded-lg mb-1 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={form.password}
            onChange={handleChange}
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-3 text-sm text-indigo-600 cursor-pointer select-none"
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm mb-4">{errors.password}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-lg font-medium transition duration-200"
        >
          Login
        </button>

        {/* Register Button */}
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="w-full mt-4 bg-gray-100 text-gray-700 hover:bg-gray-200 py-2 rounded-lg text-sm transition duration-200"
        >
          Don't have an account? Register
        </button>
      </form>
    </div>
  );
}
