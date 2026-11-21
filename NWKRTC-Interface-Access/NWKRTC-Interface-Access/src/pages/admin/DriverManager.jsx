import { ref, set, update, remove } from "firebase/database";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import CrudManager from "../../components/CrudManager.jsx";
import { db, secondaryAuth } from "../../firebase.js";
import { toEmail } from "../../context/AuthContext.jsx";
import { useList } from "../../data/dbHelpers.js";

const columns = [
  { key: "driverId", label: "Driver ID" },
  { key: "name", label: "Name" },
  { key: "phone", label: "Phone" },
  { key: "assignedBus", label: "Assigned bus" },
];

function DriverManager() {
  const { items: buses } = useList("buses");

  const fields = [
    {
      name: "driverId", label: "Driver ID", required: true, lockOnEdit: true, placeholder: "Example: D101",
      pattern: /^[A-Za-z0-9]+$/, patternMessage: "Driver ID can have only letters and numbers.",
    },
    { name: "name", label: "Driver name", required: true },
    {
      name: "phone", label: "Phone number", required: true, placeholder: "10-digit number",
      pattern: /^[0-9]{10}$/, patternMessage: "Phone number must be 10 digits.",
    },
    { name: "password", label: "Password (at least 6 characters)", type: "password", required: true, createOnly: true, minLength: 6 },
    {
      name: "busId", label: "Assigned bus", type: "select", noBlank: true,
      options: [
        { value: "", label: "Not assigned" },
        ...buses.map((b) => ({ value: b.id, label: `${b.number} (${b.registration})` })),
      ],
    },
  ];

  async function beforeSave(values, editing) {
    const bus = buses.find((b) => b.id === values.busId);
    const base = {
      driverId: values.driverId,
      name: values.name,
      phone: values.phone,
      busId: values.busId || "",
      assignedBus: bus ? `${bus.number} (${bus.registration})` : "Not assigned",
    };

    // Editing: change details only
    if (editing) {
      await update(ref(db, `users/${editing.uid}`), { name: values.name });
      return base;
    }

    // Adding: create the driver's login account
    let cred;
    try {
      cred = await createUserWithEmailAndPassword(secondaryAuth, toEmail(values.driverId, "driver"), values.password);
    } catch (err) {
      if (err.code === "auth/email-already-in-use")
        throw new Error("This Driver ID was used before. Please choose a different ID.");
      if (err.code === "auth/operation-not-allowed")
        throw new Error("Enable Email/Password sign-in in Firebase Authentication first.");
      throw err;
    }
    await signOut(secondaryAuth);
    await set(ref(db, `users/${cred.user.uid}`), { role: "driver", driverId: values.driverId, name: values.name });
    return { ...base, uid: cred.user.uid };
  }

  // Removing the role record stops the driver from opening the Driver module
  async function onRemove(item) {
    if (item.uid) await remove(ref(db, `users/${item.uid}`));
  }

  return (
    <CrudManager
      title="Drivers"
      path="drivers"
      idField="driverId"
      fields={fields}
      columns={columns}
      beforeSave={beforeSave}
      onRemove={onRemove}
    />
  );
}

export default DriverManager;
