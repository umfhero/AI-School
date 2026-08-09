"use client";

import { useEffect, useState } from "react";

export default function SignupCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    void fetch("/api/community", { credentials: "same-origin", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Signup count unavailable");
        const data = await response.json() as { count?: unknown };
        const value = Number(data.count);
        if (!Number.isFinite(value) || value < 0) throw new Error("Invalid signup count");
        setCount(Math.floor(value));
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) console.error("Signup count unavailable", error);
      });

    return () => controller.abort();
  }, []);

  return <b aria-live="polite">{count === null ? "..." : count.toLocaleString("en-GB")}</b>;
}
