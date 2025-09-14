import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Candidate } from "./CandidateCard";

interface CandidateListProps {
  candidates: Candidate[];
  selectedId: string;
  onSelect: (candidate: Candidate) => void;
  className?: string;
}

const getScoreColor = (score: number) => {
  if (score >= 90) return "text-score-excellent";
  if (score >= 70) return "text-score-good";
  if (score >= 50) return "text-score-average";
  if (score >= 30) return "text-score-poor";
  return "text-score-critical";
};

const getRankBadgeColor = (rank: number, total: number) => {
  const percentage = (rank / total) * 100;
  if (percentage <= 10) return "bg-score-excellent/20 text-score-excellent border-score-excellent/30";
  if (percentage <= 30) return "bg-score-good/20 text-score-good border-score-good/30";
  if (percentage <= 60) return "bg-score-average/20 text-score-average border-score-average/30";
  return "bg-score-poor/20 text-score-poor border-score-poor/30";
};

export function CandidateList({ candidates, selectedId, onSelect, className }: CandidateListProps) {
  return (
    <div className={cn("h-full bg-dashboard-sidebar border-r", className)}>
      <div className="p-4 border-b bg-card">
        <h2 className="text-lg font-semibold text-foreground">
          Candidats ({candidates.length})
        </h2>
        <p className="text-sm text-muted-foreground">
          Classés par score décroissant
        </p>
      </div>
      
      <ScrollArea className="flex-1 h-[calc(100vh-120px)]">
        <div className="p-2 space-y-2">
          {candidates.map((candidate) => {
            const initials = candidate.name
              .split(" ")
              .map(n => n[0])
              .join("")
              .toUpperCase();

            const isSelected = candidate.id === selectedId;

            return (
              <Card
                key={candidate.id}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-card hover:scale-[1.02] border",
                  isSelected 
                    ? "ring-2 ring-dashboard-highlight shadow-elevated bg-card" 
                    : "hover:bg-card/50"
                )}
                onClick={() => onSelect(candidate)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 ring-1 ring-border">
                      <AvatarImage src={candidate.avatar} alt={candidate.name} />
                      <AvatarFallback className="text-sm font-medium">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-foreground truncate">
                          {candidate.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className={cn("text-lg font-bold", getScoreColor(candidate.score))}>
                            {candidate.score}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground truncate mb-2">
                        {candidate.position}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant="outline"
                          className={cn("text-xs", getRankBadgeColor(candidate.rank, candidate.totalCandidates))}
                        >
                          #{candidate.rank}
                        </Badge>
                        
                        <div className="flex gap-1">
                          {candidate.skills.slice(0, 2).map((skill, index) => (
                            <Badge 
                              key={index}
                              variant="secondary" 
                              className="text-xs px-2 py-0"
                            >
                              {skill.name}
                            </Badge>
                          ))}
                          {candidate.skills.length > 2 && (
                            <Badge variant="secondary" className="text-xs px-2 py-0">
                              +{candidate.skills.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}