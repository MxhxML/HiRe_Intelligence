import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScoreGauge } from "./ScoreGauge";
import { SkillBadge } from "./SkillBadge";
import { Calendar, Mail, Phone, MapPin, GraduationCap, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import ScheduleButton from "@/components/ScheduleButton";
import { PhoneButton } from "@/components/ui/PhoneButton";

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location: string;
  position: string;
  experience: string;
  education: string;
  avatar?: string;
  score: number;
  rank: number;
  totalCandidates: number;
  skills: Array<{
    name: string;
    type: "technical" | "soft" | "leadership" | "language";
    level: "beginner" | "intermediate" | "advanced" | "expert";
  }>;
  summary: string;
  appliedDate: string;
}

interface CandidateCardProps {
  candidate: Candidate;
  className?: string;
}

const getRankColor = (rank: number, total: number) => {
  const percentage = (rank / total) * 100;
  if (percentage <= 10) return "text-score-excellent bg-score-excellent/10";
  if (percentage <= 30) return "text-score-good bg-score-good/10";
  if (percentage <= 60) return "text-score-average bg-score-average/10";
  return "text-score-poor bg-score-poor/10";
};

export function CandidateCard({ candidate, className }: CandidateCardProps) {
  const initials = candidate.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className={cn("bg-gradient-card shadow-elevated border-0", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-2 ring-primary/10">
              <AvatarImage src={candidate.avatar} alt={candidate.name} />
              <AvatarFallback className="text-lg font-semibold bg-gradient-highlight text-white">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-1">{candidate.name}</h2>
              <p className="text-dashboard-highlight font-medium mb-2">{candidate.position}</p>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {candidate.location}
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  {candidate.experience}
                </div>
                <div className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" />
                  {candidate.education}
                </div>
              </div>
            </div>
          </div>

          <div className="text-right">
            <ScoreGauge score={candidate.score} size="lg" className="mb-3" />
            <Badge
              variant="secondary"
              className={cn("font-semibold", getRankColor(candidate.rank, candidate.totalCandidates))}
            >
              #{candidate.rank} sur {candidate.totalCandidates}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Compétences */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 text-lg">Compétences clés</h3>
          <div className="flex flex-wrap gap-2">
            {candidate.skills.map((skill, index) => (
              <SkillBadge key={index} skill={skill.name} type={skill.type} level={skill.level} />
            ))}
          </div>
        </div>

        {/* Résumé */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 text-lg">Résumé du profil</h3>
          <p className="text-muted-foreground leading-relaxed bg-muted/50 p-4 rounded-lg">{candidate.summary}</p>
        </div>

        {/* Actions : Schedule, Mail, Phone */}
        <div className="flex gap-3 pt-4 border-t">
  <ScheduleButton candidate={candidate} />
  <Button variant="outline" className="flex-1" onClick={() => window.location.href = `mailto:${candidate.email}`}>
    <Mail className="h-4 w-4 mr-2" /> Contacter
  </Button>
  {candidate.phone && <PhoneButton phone={candidate.phone} />}
</div>

      </CardContent>
    </Card>
  );
}
