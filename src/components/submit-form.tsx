"use client";

import { Check, CircleAlert, LoaderCircle, Send } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { categories } from "@/content/categories";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "done";

const fieldBase =
  "focus-ring w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none transition placeholder:text-ink-subtle focus:border-line-strong";

export function SubmitForm() {
  const params = useSearchParams();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus("submitting");
    setErrors({});

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await response.json();

      if (!response.ok) {
        setErrors(body.fieldErrors ?? { form: body.error ?? "Something went wrong" });
        setStatus("idle");
        return;
      }

      setMessage(body.message);
      setStatus("done");
      form.reset();
    } catch {
      setErrors({ form: "Could not reach the server. Try again in a moment." });
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div className="card flex flex-col items-start gap-5 p-10">
        <span className="grid size-11 place-items-center rounded-full bg-cool/10 text-cool">
          <Check className="size-5" aria-hidden />
        </span>
        <div>
          <h2 className="font-display text-3xl tracking-tight">Received</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">{message}</p>
        </div>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="focus-ring rounded-full border border-line px-4 py-2 text-sm transition hover:border-line-strong"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-6 p-8" noValidate>
      <Field label="Word or phrase" error={errors.term} htmlFor="term">
        <input
          id="term"
          name="term"
          defaultValue={params.get("term") ?? ""}
          placeholder="e.g. aura farming"
          className={fieldBase}
          required
        />
      </Field>

      <Field label="Category" error={errors.category} htmlFor="category">
        <select id="category" name="category" defaultValue="slang" className={cn(fieldBase, "cursor-pointer")}>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="What does it mean?"
        hint="One or two sentences is plenty."
        error={errors.definition}
        htmlFor="definition"
      >
        <textarea
          id="definition"
          name="definition"
          rows={4}
          placeholder="Describe the meaning as you understand it."
          className={cn(fieldBase, "resize-y")}
          required
        />
      </Field>

      <Field label="Example in use" hint="Optional" error={errors.example} htmlFor="example">
        <input
          id="example"
          name="example"
          placeholder="A sentence someone would actually say."
          className={fieldBase}
        />
      </Field>

      <Field
        label="Where did you see it?"
        hint="Optional. A link, a platform, or a rough date."
        error={errors.source}
        htmlFor="source"
      >
        <input id="source" name="source" placeholder="e.g. TikTok comments, early 2025" className={fieldBase} />
      </Field>

      <Field label="Your name or handle" hint="Optional" error={errors.submitter} htmlFor="submitter">
        <input id="submitter" name="submitter" placeholder="Credited if the entry is published" className={fieldBase} />
      </Field>

      {errors.form ? (
        <p className="flex items-center gap-2 text-sm text-hot">
          <CircleAlert className="size-4 shrink-0" aria-hidden />
          {errors.form}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="focus-ring inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent text-sm font-medium text-accent-ink transition hover:brightness-110 disabled:opacity-60"
      >
        {status === "submitting" ? (
          <LoaderCircle className="size-4 animate-spin" aria-hidden />
        ) : (
          <Send className="size-4" aria-hidden />
        )}
        {status === "submitting" ? "Sending" : "Send it in"}
      </button>
    </form>
  );
}

function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="text-sm font-medium">
          {label}
        </label>
        {hint ? <span className="text-xs text-ink-subtle">{hint}</span> : null}
      </div>
      {children}
      {error ? <p className="mt-2 text-xs text-hot">{error}</p> : null}
    </div>
  );
}
