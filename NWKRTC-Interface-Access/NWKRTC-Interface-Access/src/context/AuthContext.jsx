import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { ref, get } from "firebase/database";
import { auth, db } from "../firebase.js";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// Firebase login needs an email, so we build one from the Driver ID / Admin username.
export function toEmail(id, role) {
  return `${id.trim().toLowerCase()}@${role}.nwkrtc.app`;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Firebase user
  const [profile, setProfile] = useState(null); // { role, name, driverId } from database
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    return onAuthStateChanged(auth, async (u) => {
      let p = null;
      if (u) {
        try {
          p = (await get(ref(db, `users/${u.uid}`))).val();
        } catch (e) {
          p = null;
        }
      }
      setProfile(p);
      setUser(u);
      setLoading(false);
    });
  }, []);

  // role = "admin" or "driver"
  async function login(id, password, role) {
    const cred = await signInWithEmailAndPassword(auth, toEmail(id, role), password);
    const p = (await get(ref(db, `users/${cred.user.uid}`))).val();
    if (!p || p.role !== role) {
      await signOut(auth);
      throw new Error(`This account is not allowed to open the ${role} module.`);
    }
  }

  function logout() {
    return auth ? signOut(auth) : Promise.resolve();
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
