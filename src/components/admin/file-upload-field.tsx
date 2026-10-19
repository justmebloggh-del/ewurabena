"use client";

import { useState } from "react";

import { uploadFile } from "@/lib/upload-file";

type FileUploadFieldProps = {
  name: string;
  placeholder: string;
  accept: string;
  defaultValue?: string;
};

// Used inside the "Add X" forms, which read values via native FormData on
// submit — so this stays a plain text input (with `name`) that a file
// picker can also fill in, rather than a fully separate controlled widget.
export function FileUploadField({ name, placeholder, accept, defaultValue = "" }: FileUploadFieldProps) {
  const [value, setValue] = useState(defaultValue);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");

  async function handleFile(file: File) {
    setStatus("uploading");
    try {
      const url = await uploadFile(file);
      setValue(url);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="space-y-1">
      <input
        type="text"
        name={name}
        className="input"
        placeholder={placeholder}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <div className="flex items-center gap-2 text-xs text-[color:var(--text-dark-muted)]">
        <input
          type="file"
          accept={accept}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        {status === "uploading" && <span>Uploading…</span>}
        {status === "error" && <span className="text-rose-600">Upload failed — try again or paste a link.</span>}
      </div>
    </div>
  );
}
