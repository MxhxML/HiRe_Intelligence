import { cn } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const getScoreColor = (score: number) => {
  if (score >= 90) return "text-score-excellent";
  if (score >= 70) return "text-score-good";
  if (score >= 50) return "text-score-average";
  if (score >= 30) return "text-score-poor";
  return "text-score-critical";
};

const getScoreLabel = (score: number) => {
  if (score >= 90) return "Excellent";
  if (score >= 70) return "Bon";
  if (score >= 50) return "Moyen";
  if (score >= 30) return "Faible";
  return "Critique";
};

export function ScoreGauge({ score, size = "md", className }: ScoreGaugeProps) {
  const containerSize = size === "sm" ? 80 : size === "md" ? 112 : 144; // correspond à sizeClasses
  const radius = containerSize / 2;
  const strokeWidth = size === "sm" ? 6 : size === "md" ? 8 : 10;
  const normalizedRadius = radius - strokeWidth / 2; // plus petit pour mieux centrer
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-28 h-28",
    lg: "w-36 h-36"
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl"
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        <circle
          stroke="hsl(var(--border))"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="url(#scoreGradient)"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-1000 ease-out"
          style={{
            filter: "drop-shadow(var(--shadow-score))"
          }}
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--score-critical))" />
            <stop offset="25%" stopColor="hsl(var(--score-poor))" />
            <stop offset="50%" stopColor="hsl(var(--score-average))" />
            <stop offset="75%" stopColor="hsl(var(--score-good))" />
            <stop offset="100%" stopColor="hsl(var(--score-excellent))" />
          </linearGradient>
        </defs>
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-bold", textSizes[size], getScoreColor(score))}>
          {score}
        </span>
        <span className="text-xs text-muted-foreground font-medium">
          {getScoreLabel(score)}
        </span>
      </div>
    </div>
  );
}