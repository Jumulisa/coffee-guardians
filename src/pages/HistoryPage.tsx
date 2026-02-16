import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getStoredHistory, clearHistory, DiagnosisResult } from "@/lib/mock-data";
import { Camera, Trash2, Leaf, ArrowRight, Calendar, AlertCircle } from "lucide-react";
import { useState } from "react";

const severityColors = {
  mild: "bg-green-500 text-white",
  moderate: "bg-yellow-500 text-white",
  severe: "bg-red-500 text-white",
};

const severityEmoji = {
  mild: "😊",
  moderate: "⚠️",
  severe: "🚨",
};

const HistoryPage = () => {
  const { t, language } = useLanguage();
  const [history, setHistory] = useState<DiagnosisResult[]>(getStoredHistory);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handleClear = () => {
    clearHistory();
    setHistory([]);
    setDeleteConfirm(false);
  };

  const stats = {
    total: history.length,
    severe: history.filter((h) => h.severity === "severe").length,
    moderate: history.filter((h) => h.severity === "moderate").length,
    mild: history.filter((h) => h.severity === "mild").length,
  };

  return (
    <main className="min-h-[calc(100vh-64px)] px-4 py-12 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold text-foreground">{t("historyTitle")}</h1>
            <p className="text-muted-foreground mt-2">Track and manage your diagnosis history</p>
          </div>
          {history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteConfirm(!deleteConfirm)}
              className="text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="mr-1 h-4 w-4" />
              {t("clearHistory")}
            </Button>
          )}
        </div>

        {/* Delete Confirmation */}
        {deleteConfirm && (
          <Card className="mb-6 border-destructive/50 bg-destructive/5 animate-shake">
            <CardContent className="pt-6 space-y-4">
              <p className="font-semibold text-foreground">Are you sure? This action cannot be undone.</p>
              <div className="flex gap-3">
                <Button onClick={handleClear} variant="destructive" className="flex-1">
                  Delete All
                </Button>
                <Button
                  onClick={() => setDeleteConfirm(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        {history.length > 0 && (
          <div className="grid grid-cols-4 gap-3 mb-8 animate-slide-up">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              <p className="text-xs text-blue-700">Total Scans</p>
            </div>
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
              <p className="text-2xl font-bold text-red-600">{stats.severe}</p>
              <p className="text-xs text-red-700">Severe</p>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.moderate}</p>
              <p className="text-xs text-yellow-700">Moderate</p>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">{stats.mild}</p>
              <p className="text-xs text-green-700">Mild</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {history.length === 0 ? (
          <div className="py-24 text-center animate-fade-in">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 text-primary mb-6">
              <Leaf className="h-10 w-10" />
            </div>
            <p className="mb-8 text-lg text-muted-foreground">{t("historyEmpty")}</p>
            <Link to="/upload">
              <Button size="lg" className="shadow-lg hover:shadow-xl">
                <Camera className="mr-2 h-5 w-5" />
                {t("ctaButton")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        ) : (
          <div>
            {/* History List */}
            <div className="space-y-3 animate-slide-up">
              {history.map((item, index) => (
                <Link
                  key={item.id}
                  to="/result"
                  state={{ result: item }}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  className="block animate-slide-up"
                >
                  <Card className="hover:shadow-lg hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden group">
                    <CardContent className="p-0 flex items-center">
                      {/* Image */}
                      {item.imageUrl && (
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-gray-100">
                          <img
                            src={item.imageUrl}
                            alt="Diagnosis"
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                              {language === "rw" ? item.diseaseRw : item.disease}
                            </h3>
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {new Date(item.date).toLocaleDateString(language === "rw" ? "rw-RW" : "en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}{" "}
                              •{" "}
                              {new Date(item.date).toLocaleTimeString(language === "rw" ? "rw-RW" : "en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>

                          {/* Severity Badge */}
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <Badge className={`${severityColors[item.severity]}`}>
                              {severityEmoji[item.severity]} {t(item.severity as any)}
                            </Badge>
                            <span className="text-xs font-medium text-muted-foreground">
                              {Math.round(item.confidence * 100)}% confidence
                            </span>
                          </div>

                          {/* Arrow */}
                          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors ml-2" />
                        </div>

                        {/* Affected Area Progress */}
                        <div className="mt-3 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Affected area</span>
                            <span className="font-semibold text-foreground">{item.affectedArea}%</span>
                          </div>
                          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${
                                item.severity === "mild"
                                  ? "bg-green-500"
                                  : item.severity === "moderate"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${item.affectedArea}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Bottom Action */}
            <div className="mt-8 flex justify-center animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <Link to="/upload">
                <Button size="lg" className="shadow-lg hover:shadow-xl">
                  <Camera className="mr-2 h-5 w-5" />
                  New Scan
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default HistoryPage;
