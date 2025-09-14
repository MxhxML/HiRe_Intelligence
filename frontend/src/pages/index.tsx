import { useState } from "react";
import { CandidateCard } from "@/components/CandidateCard";
import { CandidateList } from "@/components/CandidateList";
import { mockCandidates } from "@/data/mockCandidates";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Users, TrendingUp, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [selectedCandidate, setSelectedCandidate] = useState(mockCandidates[0] || null);

  const currentIndex = selectedCandidate
    ? mockCandidates.findIndex(c => c.id === selectedCandidate.id)
    : -1;

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setSelectedCandidate(mockCandidates[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < mockCandidates.length - 1) {
      setSelectedCandidate(mockCandidates[currentIndex + 1]);
    }
  };

  const averageScore = mockCandidates.length > 0
    ? Math.round(mockCandidates.reduce((sum, c) => sum + c.score, 0) / mockCandidates.length)
    : 0;

  const topCandidates = mockCandidates.filter(c => c.score >= 90).length;

  if (!selectedCandidate) return <p className="p-6">Aucun candidat disponible.</p>;

  return (
    <div className="min-h-screen bg-dashboard-main">
      {/* Header */}
      <header className="bg-card border-b shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Users className="h-6 w-6 text-dashboard-highlight" />
              Dashboard RH - Évaluation Candidats
            </h1>
            <p className="text-muted-foreground">
              Poste: Développeur Full Stack • {mockCandidates.length} candidatures reçues
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-score-good" />
              <span className="text-muted-foreground">Score moyen:</span>
              <Badge variant="secondary" className="bg-score-good/10 text-score-good">
                {averageScore}/100
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Top candidats:</span>
              <Badge variant="secondary" className="bg-score-excellent/10 text-score-excellent">
                {topCandidates} excellents
              </Badge>
            </div>

            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Sidebar - Liste des candidats */}
        <CandidateList
          candidates={mockCandidates}
          selectedId={selectedCandidate.id}
          onSelect={setSelectedCandidate}
          className="w-96 flex-shrink-0"
        />

        {/* Main Content - Détail du candidat */}
        <div className="flex-1 flex flex-col">
          {/* Navigation */}
          <div className="p-4 border-b bg-card/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentIndex <= 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Précédent
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={currentIndex < 0 || currentIndex >= mockCandidates.length - 1}
              >
                Suivant
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            <Badge variant="outline" className="text-sm">
              {currentIndex >= 0
                ? `Candidat ${currentIndex + 1} sur ${mockCandidates.length}`
                : "Aucun candidat"}
            </Badge>
          </div>

          {/* Candidate Detail */}
          <div className="flex-1 p-6 overflow-auto">
            <CandidateCard
              candidate={selectedCandidate}
              className="max-w-4xl mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
