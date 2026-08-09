"use client";

import { useCallback, useEffect, useState } from "react";
import type { Experience } from "../lib/experience";
import { PixelSpark } from "./PixelIcons";

type ProgressResponse = { user: unknown; experience?: Experience };

export default function ExperienceBadge({ compact = false }: { compact?: boolean }) {
  const [experience, setExperience] = useState<Experience | null>(null);

  const loadExperience = useCallback(async () => {
    try {
      const response = await fetch("/api/progress", { credentials: "same-origin" });
      if (!response.ok) return;
      const data = await response.json() as ProgressResponse;
      setExperience(data.user ? data.experience ?? null : null);
    } catch {
      setExperience(null);
    }
  }, []);

  useEffect(() => {
    void loadExperience();
    window.addEventListener("auth-changed", loadExperience);
    window.addEventListener("progress-changed", loadExperience);
    return () => { window.removeEventListener("auth-changed", loadExperience); window.removeEventListener("progress-changed", loadExperience); };
  }, [loadExperience]);

  if (!experience) return null;

  return <div className={`experience-badge ${compact ? "compact" : ""}`} aria-label={`Level ${experience.level}, ${experience.xpInLevel} of ${experience.xpTarget} XP`}>
    <PixelSpark />
    <div><b>LV {experience.level}</b><span>{experience.xpInLevel} / {experience.xpTarget} XP</span></div>
    <i><em style={{ width: `${experience.xpPercent}%` }} /></i>
  </div>;
}
