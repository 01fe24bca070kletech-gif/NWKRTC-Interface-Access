import { useState } from "react";
import { ref, set, update, push, remove } from "firebase/database";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { db } from "../firebase.js";
import { useList } from "../data/dbHelpers.js";

// One reusable screen for Add / Edit / Delete / View.
// Buses, Drivers, Routes and Schedules all use it with different "fields".
function CrudManager({ title, path, fields, columns, defaults, idField, beforeSave, onRemove, sortBy, hint }) {
  const { items, loading, error: loadError } = useList(path);
  const [form, setForm] = useState(null); // null = form is hidden
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const shown = sortBy ? [...items].sort(sortBy) : items;

  function openAdd() {
    const empty = {};
    fields.forEach((f) => (empty[f.name] = defaults?.[f.name] ?? ""));
    setEditing(null);
    setForm(empty);
    setError("");
  }

  function openEdit(item) {
    const values = {};
    fields.forEach((f) => (values[f.name] = item[f.name] ?? ""));
    setEditing(item);
    setForm(values);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const visible = fields.filter((f) => !(editing && f.createOnly));

    // ----- form validation -----
    for (const f of visible) {
      const v = String(form[f.name] ?? "").trim();
      if (f.required && !v) return setError(`${f.label} is required.`);
      if (f.type === "number" && v !== "") {
        const n = Number(v);
        if (Number.isNaN(n)) return setError(`${f.label} must be a number.`);
        if (f.min !== undefined && n < f.min) return setError(`${f.label} must be at least ${f.min}.`);
        if (f.max !== undefined && n > f.max) return setError(`${f.label} must be at most ${f.max}.`);
      }
      if (f.minLength && v.length < f.minLength)
        return setError(`${f.label} must be at least ${f.minLength} characters.`);
      if (f.pattern && v && !f.pattern.test(v)) return setError(f.patternMessage || `${f.label} is not valid.`);
    }

    const values = {};
    visible.forEach((f) => {
      const v = String(form[f.name] ?? "").trim();
      values[f.name] = f.type === "number" ? (v === "" ? null : Number(v)) : v;
    });

    setSaving(true);
    try {
      const data = beforeSave ? await beforeSave(values, editing, items) : values;
      if (editing) {
        await update(ref(db, `${path}/${editing.id}`), data);
      } else if (idField) {
        const key = values[idField];
        if (items.some((i) => i.id === key)) throw new Error(`${key} already exists.`);
        await set(ref(db, `${path}/${key}`), data);
      } else {
        await push(ref(db, path), data);
      }
      setForm(null);
      setEditing(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    try {
      if (onRemove) await onRemove(item);
      await remove(ref(db, `${path}/${item.id}`));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="manager-head">
        <h2 className="section-title">{title}</h2>
        {!form && (
          <button className="btn btn-orange btn-small" onClick={openAdd}>
            <Plus size={18} /> Add new
          </button>
        )}
      </div>

      {hint && <p className="notice">{hint}</p>}
      {loadError && <p className="notice">{loadError}</p>}

      {form && (
        <form className="card crud-form" onSubmit={handleSubmit}>
          <h3>{editing ? "Edit" : "Add new"}</h3>
          <div className="crud-grid">
            {fields
              .filter((f) => !(editing && f.createOnly))
              .map((f) => (
                <div className="field" key={f.name}>
                  <label htmlFor={f.name}>{f.label}</label>
                  {f.type === "select" ? (
                    <select
                      id={f.name}
                      value={form[f.name]}
                      onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                    >
                      {!f.noBlank && <option value="">Select…</option>}
                      {(f.options || []).map((o) => {
                        const opt = typeof o === "string" ? { value: o, label: o } : o;
                        return (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        );
                      })}
                    </select>
                  ) : (
                    <input
                      id={f.name}
                      type={f.type || "text"}
                      placeholder={f.placeholder}
                      disabled={editing && f.lockOnEdit}
                      value={form[f.name]}
                      onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                    />
                  )}
                </div>
              ))}
          </div>
          {error && <p className="notice">{error}</p>}
          <div className="form-actions">
            <button type="submit" className="btn btn-green btn-small" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              className="btn btn-light btn-small"
              onClick={() => {
                setForm(null);
                setEditing(null);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {!form && error && <p className="notice">{error}</p>}

      <div className="card table-wrap">
        {loading ? (
          <p>Loading…</p>
        ) : shown.length === 0 ? (
          <p className="small-note">Nothing added yet. Click "Add new".</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c.label}>{c.label}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((item) => (
                <tr key={item.id}>
                  {columns.map((c) => (
                    <td key={c.label}>{c.render ? c.render(item) : item[c.key] ?? "-"}</td>
                  ))}
                  <td className="row-actions">
                    <button className="icon-btn" title="Edit" onClick={() => openEdit(item)}>
                      <Pencil size={18} />
                    </button>
                    <button className="icon-btn danger" title="Delete" onClick={() => handleDelete(item)}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default CrudManager;
