import { cn } from "@/lib/utils";

interface SkillBadgeProps {
  skill: string;
  type: "technical" | "soft" | "leadership" | "language";
  level?: "beginner" | "intermediate" | "advanced" | "expert";
  className?: string;
}

const skillTypeColors = {
  technical: "bg-skill-technical/10 text-skill-technical border-skill-technical/20",
  soft: "bg-skill-soft/10 text-skill-soft border-skill-soft/20",
  leadership: "bg-skill-leadership/10 text-skill-leadership border-skill-leadership/20",
  language: "bg-skill-language/10 text-skill-language border-skill-language/20"
};

const levelIcons = {
  beginner: "●",
  intermediate: "●●",
  advanced: "●●●",
  expert: "●●●●"
};

export function SkillBadge({ skill, type, level, className }: SkillBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium transition-all duration-200 hover:scale-105",
        skillTypeColors[type],
        className
      )}
    >
      <span>{skill}</span>
      {level && (
        <span className="text-xs opacity-70">
          {levelIcons[level]}
        </span>
      )}
    </div>
  );
}