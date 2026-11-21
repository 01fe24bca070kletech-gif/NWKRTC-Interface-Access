import { useState } from "react";
import { LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { auth } from "../firebase.js";

function friendlyError(err) {
  const code = err.code || "";
  if (code.includes("invalid-credential") || code.includes("user-not-found") || code.includes("wrong-password"))
    return "Wrong ID or password. Please try again.";
  if (code.includes("too-many-requests")) return "Too many tries. Please wait a few minutes.";
  if (code.includes("network")) return "No internet connection.";
  if (code.includes("operation-not-allowed"))
    return "Email/Password login is not enabled in Firebase Authentication.";
  return err.message;
}

// role = "driver" or "admin"
function LoginForm({ role }) {
  const { login } = useAuth();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const isAdmin = role === "admin";

  async function handleSubmit(e) {
    e.preventDefault();
    if (!id.trim() || !password) {
      setError(`Please enter your ${isAdmin ? "username" : "Driver ID"} and password.`);
      return;
    }
    setError("");
    setBusy(true);
    try {
      await login(id, password, role);
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="section">
      <div className="container narrow">
        <h1 className="page-title">{isAdmin ? "Admin Login" : "Driver Login"}</h1>
        <p className="page-subtitle">
          {isAdmin ? "Log in to manage buses, drivers, routes and trips." : "Log in to see your assigned trips."}
        </p>

        {!auth ? (
          <p className="notice">Firebase is not set up yet. Check the .env file.</p>
        ) : (
          <form className="card login-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="loginId">{isAdmin ? "USERNAME" : "DRIVER ID"}</label>
              <input
                id="loginId"
                type="text"
                autoComplete="username"
                placeholder={isAdmin ? "Example: admin" : "Example: D101"}
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="loginPassword">PASSWORD</label>
              <input
                id="loginPassword"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="notice">{error}</p>}
            <button type="submit" className="btn btn-orange btn-large" disabled={busy}>
              <LogIn size={22} /> {busy ? "Please wait…" : "Login"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default LoginForm;
