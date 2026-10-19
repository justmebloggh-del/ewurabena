"use client";

import { useState } from "react";

import { uploadFile } from "@/lib/upload-file";

export type ManageField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "date" | "select" | "file";
  options?: { value: string; label: string }[];
  accept?: string;
};

type BaseItem = { id: string; is_published?: boolean };

type Status = { kind: "ok" | "error"; text: string } | null;

type ManageListProps<T extends BaseItem> = {
  title: string;
  items: T[];
  endpoint: string;
  responseKey: string;
  fields: ManageField[];
  renderSummary: (item: T) => { primary: string; secondary?: string };
  onItemsChange: (items: T[]) => void;
  onStatus: (status: Status) => void;
};

export function ManageList<T extends BaseItem>({
  title,
  items,
  endpoint,
  responseKey,
  fields,
  renderSummary,
  onItemsChange,
  onStatus,
}: ManageListProps<T>) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  async function handleFileUpload(fieldName: string, file: File) {
    setUploadingField(fieldName);
    try {
      const url = await uploadFile(file);
      setDraft((prev) => ({ ...prev, [fieldName]: url }));
    } catch {
      onStatus({ kind: "error", text: "Upload failed — try again or paste a link instead." });
    } finally {
      setUploadingField(null);
    }
  }

  function startEdit(item: T) {
    const next: Record<string, string> = {};
    for (const field of fields) {
      const value = (item as Record<string, unknown>)[field.name];
      next[field.name] = value === null || value === undefined ? "" : String(value);
    }
    setDraft(next);
    setEditingId(item.id);
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft({});
  }

  function buildPayload() {
    const payload: Record<string, unknown> = {};
    for (const field of fields) {
      const raw = draft[field.name] ?? "";
      payload[field.name] = field.type === "number" ? (raw === "" ? undefined : Number(raw)) : raw;
    }
    return payload;
  }

  async function patch(id: string, payload: Record<string, unknown>) {
    setBusyId(id);
    const response = await fetch(`${endpoint}?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    setBusyId(null);

    if (!response.ok) {
      onStatus({ kind: "error", text: data.error || "Request failed." });
      return null;
    }

    const updated = data[responseKey] as T;
    onItemsChange(items.map((item) => (item.id === id ? { ...item, ...updated } : item)));
    return updated;
  }

  async function saveEdit(id: string) {
    const updated = await patch(id, buildPayload());
    if (updated) {
      onStatus({ kind: "ok", text: "Saved successfully." });
      cancelEdit();
    }
  }

  async function togglePublished(item: T) {
    const updated = await patch(item.id, { is_published: !item.is_published });
    if (updated) {
      onStatus({ kind: "ok", text: "Updated." });
    }
  }

  async function deleteItem(id: string) {
    if (!window.confirm("Delete this item? This cannot be undone.")) {
      return;
    }

    setBusyId(id);
    const response = await fetch(`${endpoint}?id=${id}`, { method: "DELETE" });
    setBusyId(null);

    if (!response.ok) {
      onStatus({ kind: "error", text: "Failed to delete item." });
      return;
    }

    onItemsChange(items.filter((item) => item.id !== id));
    onStatus({ kind: "ok", text: "Deleted." });
  }

  return (
    <section className="card space-y-4">
      <h2 className="text-2xl">{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-[color:var(--text-dark-muted)]">Nothing here yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const { primary, secondary } = renderSummary(item);
            const isEditing = editingId === item.id;
            const isBusy = busyId === item.id;

            return (
              <article key={item.id} className="rounded-xl border border-[color:var(--border-soft)] p-4 space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-[color:var(--text-dark)]">{primary}</p>
                    {secondary ? <p className="text-sm text-[color:var(--text-dark-muted)]">{secondary}</p> : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="flex items-center gap-1.5 text-xs text-[color:var(--text-dark-muted)]">
                      <input
                        type="checkbox"
                        checked={Boolean(item.is_published)}
                        disabled={isBusy}
                        onChange={() => togglePublished(item)}
                      />
                      Published
                    </label>
                    <button
                      type="button"
                      className="btn-secondary"
                      disabled={isBusy}
                      onClick={() => (isEditing ? cancelEdit() : startEdit(item))}
                    >
                      {isEditing ? "Cancel" : "Edit"}
                    </button>
                    <button type="button" className="btn-danger" disabled={isBusy} onClick={() => deleteItem(item.id)}>
                      Delete
                    </button>
                  </div>
                </div>

                {isEditing ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {fields.map((field) => (
                      <label
                        key={field.name}
                        className={field.type === "textarea" ? "sm:col-span-2 space-y-1" : "space-y-1"}
                      >
                        <span className="text-xs uppercase tracking-wide text-[color:var(--text-dark-muted)]">
                          {field.label}
                        </span>
                        {field.type === "textarea" ? (
                          <textarea
                            className="input"
                            rows={3}
                            value={draft[field.name] ?? ""}
                            onChange={(event) => setDraft((prev) => ({ ...prev, [field.name]: event.target.value }))}
                          />
                        ) : field.type === "select" ? (
                          <select
                            className="input"
                            value={draft[field.name] ?? ""}
                            onChange={(event) => setDraft((prev) => ({ ...prev, [field.name]: event.target.value }))}
                          >
                            {field.options?.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : field.type === "file" ? (
                          <div className="space-y-1">
                            <input
                              className="input"
                              type="text"
                              value={draft[field.name] ?? ""}
                              onChange={(event) => setDraft((prev) => ({ ...prev, [field.name]: event.target.value }))}
                            />
                            <div className="flex items-center gap-2 text-xs text-[color:var(--text-dark-muted)]">
                              <input
                                type="file"
                                accept={field.accept}
                                onChange={(event) => {
                                  const file = event.target.files?.[0];
                                  if (file) handleFileUpload(field.name, file);
                                }}
                              />
                              {uploadingField === field.name && <span>Uploading…</span>}
                            </div>
                          </div>
                        ) : (
                          <input
                            className="input"
                            type={field.type}
                            value={draft[field.name] ?? ""}
                            onChange={(event) => setDraft((prev) => ({ ...prev, [field.name]: event.target.value }))}
                          />
                        )}
                      </label>
                    ))}
                    <div className="sm:col-span-2">
                      <button type="button" className="btn-primary" disabled={isBusy} onClick={() => saveEdit(item.id)}>
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
