import { useLocation, useNavigate, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DiagnosisResult } from "@/lib/mock-data";
import { Camera, ChevronDown, ChevronUp, BookOpen, Leaf, AlertCircle, CheckCircle, Clock, Droplet } from "lucide-react";
import { useState } from "react";

const severityConfig = {
  mild: { label: "mild", color: "bg-green-500 text-white", emoji: "😊", icon: CheckCircle },
  moderate: { label: "moderate", color: "bg-yellow-500 text-white", emoji: "⚠️", icon: AlertCircle },
  severe: { label: "severe", color: "bg-red-500 text-white", emoji: "🚨", icon: AlertCircle },
};

const ResultPage = () => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [showAlt, setShowAlt] = useState(false);

  const result = (location.state as { result?: DiagnosisResult })?.result;

  if (!result) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
        <div className="text-center animate-fade-in">
          <p className="mb-4 text-muted-foreground">No diagnosis data found.</p>
          <Link to="/upload">
            <Button>{t("ctaButton")}</Button>
          </Link>
        </div>
      </main>
    );
  }

  const sev = severityConfig[result.severity];
  const confidencePercent = Math.round(result.confidence * 100);
  const confidenceLabel =
    result.confidence >= 0.8
      ? t("confidenceHigh")
      : result.confidence >= 0.5
      ? t("confidenceMedium")
      : t("confidenceLow");

  const diseaseName = language === "rw" ? result.diseaseRw : result.disease;
  const action = language === "rw" ? result.treatment.actionRw : result.treatment.action;
  const instructions = language === "rw" ? result.treatment.instructionsRw : result.treatment.instructions;
  const alternative = language === "rw" ? result.treatment.alternativeRw : result.treatment.alternative;

  return (
    <main className="min-h-[calc(100vh-64px)] px-4 py-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-2">{t("diagnosisResult")}</h1>
          <p className="text-muted-foreground">Analysis complete - See recommendations below</p>
        </div>

        {/* Disease Diagnosis Card */}
        <Card className="border-0 shadow-lg overflow-hidden animate-slide-up">
          <CardContent className="p-0">
            {result.imageUrl && (
              <div className="relative">
                <img
                  src={result.imageUrl}
                  alt="Diagnosed leaf"
                  className="w-full object-cover max-h-64"
                />
                <div className="absolute top-4 right-4">
                  <Badge className={`${sev.color} text-lg px-4 py-2 shadow-lg`}>
                    {sev.emoji} {t(sev.label as any)}
                  </Badge>
                </div>
              </div>
            )}
            <div className="p-6 border-t bg-gradient-to-br from-white to-gray-50">
              <p className="text-sm uppercase tracking-widest text-muted-foreground font-semibold mb-2">{t("disease")}</p>
              <h2 className="text-3xl font-bold text-foreground mb-4">{diseaseName}</h2>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Confidence</p>
                  <p className="text-2xl font-bold text-primary">{confidencePercent}%</p>
                  <p className="text-xs text-muted-foreground mt-1">{confidenceLabel}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Affected Area</p>
                  <p className="text-2xl font-bold text-orange-500">{result.affectedArea}%</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Severity</p>
                  <Badge className={`${sev.color} text-sm px-2 py-1 block text-center`}>
                    {t(sev.label as any)}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Confidence Progress */}
        <Card className="border-0 shadow-lg animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-foreground">Diagnosis Confidence</p>
                  <span className="text-sm font-bold text-primary">{confidencePercent}%</span>
                </div>
                <Progress value={confidencePercent} className="h-3" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-600 font-semibold mb-1">Detection Accuracy</p>
                  <p className="text-sm text-blue-900">High confidence diagnosis</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-xs text-purple-600 font-semibold mb-1">Analyzed Area</p>
                  <p className="text-sm text-purple-900">{result.affectedArea}% affected</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Treatment Recommendations */}
        <Card className="border-0 shadow-lg border-l-4 border-l-primary animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent">
            <CardTitle className="flex items-center gap-2 text-xl">
              <BookOpen className="h-5 w-5 text-primary" />
              {t("treatmentRec")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {/* Recommended Action */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground">{t("recommendedAction")}</p>
              </div>
              <div className={`p-4 rounded-lg border-l-4 ${
                result.severity === "mild" ? "bg-green-50 border-l-green-500" :
                result.severity === "moderate" ? "bg-yellow-50 border-l-yellow-500" :
                "bg-red-50 border-l-red-500"
              }`}>
                <p className="font-semibold text-foreground">{action}</p>
              </div>
            </div>

            {/* Application Instructions */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Droplet className="h-4 w-4 text-primary" />
                <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground">{t("applicationInstructions")}</p>
              </div>
              <div className="space-y-2 pl-6 border-l-2 border-primary/20">
                {instructions.split("\n").map((line, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary/20 text-primary text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-sm text-foreground pt-0.5">{line}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Estimated Cost */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs uppercase tracking-wide text-green-600 font-semibold mb-1">{t("estimatedCost")}</p>
              <p className="text-2xl font-bold text-green-700">{result.treatment.cost}</p>
            </div>

            {/* Alternative Treatment Toggle */}
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => setShowAlt(!showAlt)}
            >
              {t("alternativeTreatment")}
              {showAlt ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>

            {/* Alternative Treatment Details */}
            {showAlt && (
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 space-y-2 animate-slide-down">
                <p className="text-xs uppercase tracking-wide text-blue-600 font-semibold">Alternative Option</p>
                <p className="text-sm text-blue-900">{alternative}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 pt-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <Link to="/history" className="flex-1">
            <Button variant="outline" size="lg" className="w-full py-6 hover:border-primary hover:text-primary">
              <Leaf className="mr-2 h-5 w-5" />
              {t("historyTitle")}
            </Button>
          </Link>
          <Link to="/upload" className="flex-1">
            <Button size="lg" className="w-full py-6 shadow-lg hover:shadow-xl">
              <Camera className="mr-2 h-5 w-5" />
              Upload New Image
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ResultPage;
