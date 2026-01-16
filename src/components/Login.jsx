import { useState } from "react";
import { loginAdmin } from "../api/api";
import "../styles/login.css";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginAdmin(form);

      if (res?.token) {
        localStorage.setItem("token", res.token);
        onLogin();
      } else {
        setError(res?.message || "Invalid email or password");
      }
    } catch (err) {
      setError(err.message || "Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-wrapper">
      <form className="login-box" onSubmit={submit}>
        <h2>Admin Login</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}
