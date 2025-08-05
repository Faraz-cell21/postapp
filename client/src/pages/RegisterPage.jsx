import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function RegisterPage() {
  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const validate = () => {
    let valid = true;
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      general: "",
    };

    if (!form.name.trim()) {
      newErrors.name = "Name is required.";
      valid = false;
    }

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
      newErrors.password = "Password must be 8–15 characters long.";
      valid = false;
    }

    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm your password.";
      valid = false;
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
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

    const res = await register(form.name, form.email, form.password);
    if (res.success) {
      navigate("/dashboard");
    } else {
      setErrors((prev) => ({
        ...prev,
        general: res.message || "Registration failed. Try again.",
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-lg rounded-2xl px-8 py-10"
      >
        <h2 className="text-3xl font-bold text-indigo-600 text-center mb-6">
          Register
        </h2>

        {errors.general && (
          <p className="text-red-600 text-sm mb-4 text-center">{errors.general}</p>
        )}

        {/* Name */}
        <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
        <input
          name="name"
          placeholder="Enter your name"
          className="w-full border border-gray-300 p-3 rounded-lg mb-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={form.name}
          onChange={handleChange}
        />
        {errors.name && <p className="text-red-500 text-sm mb-3">{errors.name}</p>}

        {/* Email */}
        <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
        <input
          name="email"
          placeholder="Enter your email"
          className="w-full border border-gray-300 p-3 rounded-lg mb-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && <p className="text-red-500 text-sm mb-3">{errors.email}</p>}

        {/* Password */}
        <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full border border-gray-300 p-3 rounded-lg mb-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={form.password}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-sm text-gray-600"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm mb-3">{errors.password}</p>
        )}

        {/* Confirm Password */}
        <label className="block mb-1 text-sm font-medium text-gray-700">Confirm Password</label>
        <div className="relative">
          <input
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            className="w-full border border-gray-300 p-3 rounded-lg mb-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 text-sm text-gray-600"
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mb-4">{errors.confirmPassword}</p>
        )}

        {/* Register Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-lg font-medium transition duration-200"
        >
          Register
        </button>

        {/* Login Navigation */}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full mt-4 bg-gray-100 text-gray-700 hover:bg-gray-200 py-2 rounded-lg text-sm transition duration-200"
        >
          Already have an account? Login
        </button>
      </form>
    </div>
  );
}
