import React, { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Camera, Upload as UploadIcon, ImagePlus, Loader2, Lightbulb, X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mlService, BackendPrediction } from "@/lib/ml-service";
import { saveDiagnosis } from "@/lib/db-service";

const UploadPage = () => {
  const { t, language } = useLanguage();
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [useBackend, setUseBackend] = useState(true);
  const [prediction, setPrediction] = useState<BackendPrediction | null>(null);
  let progressInterval: ReturnType<typeof setInterval>;


  // Removed backend health check (not supported by Colab proxy)

  // Presentation mode: do not redirect to login
  // useEffect(() => {
  //   if (!authLoading && !user) {
  //     navigate("/login");
  //   }
  // }, [user, authLoading, navigate]);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setSelectedFile(file);
    setApiError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile || !preview) return;
    // Presentation mode: use fallback user id if not authenticated
    const userId = user?.id || "demo-user";
    setIsAnalyzing(true);
    setUploadProgress(0);
    setApiError(null);
    setPrediction(null);

    try {
      // Simulate progress while uploading
      progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 20;
        });
      }, 200);

      // Call backend API
      const pred = await mlService.predictDisease(selectedFile);
      clearInterval(progressInterval);
      setUploadProgress(100);
      setPrediction(pred);

      // Save diagnosis to Supabase database
      const diagnosisRecord = await saveDiagnosis(userId, {
        image_url: preview, // Store base64 data URL (consider using Supabase Storage for large files)
        disease_name: pred.disease,
        confidence: pred.confidence,
        severity: pred.severity,
        affected_area: pred.affectedArea,
        treatment_action: pred.treatment.action,
        treatment_duration: undefined,
        estimated_cost: pred.treatment.cost || undefined,
      });

      // Show prediction for 2 seconds, then navigate
      setTimeout(() => {
        setIsAnalyzing(false);
        navigate("/result", { 
          state: { 
            result: {
              id: diagnosisRecord.id,
              imageUrl: preview,
              date: diagnosisRecord.created_at,
              disease: pred.disease,
              diseaseRw: pred.diseaseRw,
              confidence: pred.confidence,
              severity: pred.severity,
              affectedArea: pred.affectedArea,
              treatment: pred.treatment,
            }
          } 
        });
      }, 2000);
    } catch (error) {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
      setPrediction(null);
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      setApiError(errorMessage);
      console.error('Analysis error:', error);
    }
  }, [selectedFile, preview, navigate, user]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const clearPreview = useCallback(() => {
    setPreview(null);
  }, []);

  if (isAnalyzing) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute inset-2 flex items-center justify-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-bold text-foreground">{t("analyzing")}</h2>
            <p className="text-muted-foreground">{t("analyzingDesc")}</p>
          </div>

          {/* Progress Bar */}
          <div className="w-64 space-y-2">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground">{Math.round(uploadProgress)}% complete</p>
          </div>

          {/* Timeline */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Image uploaded</span>
            </div>
            <div className={`flex items-center gap-2 ${uploadProgress > 30 ? "text-foreground" : "text-muted-foreground"}`}>
              {uploadProgress > 30 ? <CheckCircle className="h-4 w-4 text-green-500" /> : <div className="h-4 w-4 rounded-full border-2 border-muted-foreground"></div>}
              <span>Processing image</span>
            </div>
            <div className={`flex items-center gap-2 ${uploadProgress > 70 ? "text-foreground" : "text-muted-foreground"}`}>
              {uploadProgress > 70 ? <CheckCircle className="h-4 w-4 text-green-500" /> : <div className="h-4 w-4 rounded-full border-2 border-muted-foreground"></div>}
              <span>Analyzing disease</span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-64px)] px-4 py-12 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-10 text-center animate-fade-in">
          <h1 className="mb-3 text-4xl font-bold text-foreground">{t("uploadTitle")}</h1>
          <p className="text-lg text-muted-foreground">{t("uploadDesc")}</p>
        </div>

        {/* Upload Card */}
        <Card
          className={`mb-6 border-2 border-dashed transition-all duration-300 cursor-pointer animate-slide-up ${
            isDragging
              ? "border-primary bg-primary/10 shadow-lg"
              : preview
              ? "border-green-200 bg-green-50"
              : "border-secondary hover:border-primary/50"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !preview && fileInputRef.current?.click()}
        >
          <CardContent className="flex flex-col items-center py-16 px-6">
            {preview ? (
              <div className="w-full space-y-4 animate-scale-in">
                <div className="relative inline-block w-full max-w-xs mx-auto">
                  <img
                    src={preview}
                    alt="Leaf preview"
                    className="w-full rounded-lg object-contain shadow-md border border-gray-200"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearPreview();
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-center">
                  <p className="text-sm text-green-600 font-medium mb-1">✓ Image ready for analysis</p>
                  <p className="text-xs text-muted-foreground">Click analyze button to start diagnosis</p>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4 animate-fade-in">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 text-primary">
                  <ImagePlus className="h-10 w-10" />
                </div>
                <div>
                  <p className="mb-1 text-lg font-semibold text-foreground">{t("dragDrop")}</p>
                  <p className="text-muted-foreground">{t("orText")}</p>
                </div>
                <p className="text-xs text-muted-foreground pt-2">
                  Supported formats: JPG, PNG, WebP (Max 10MB)
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-8 animate-slide-up">
          <Button
            variant="outline"
            size="lg"
            className="py-6 hover:border-primary hover:text-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadIcon className="mr-2 h-5 w-5" />
            {t("browseFiles")}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="py-6 hover:border-primary hover:text-primary transition-colors"
            onClick={() => cameraInputRef.current?.click()}
          >
            <Camera className="mr-2 h-5 w-5" />
            {t("takePhoto")}
          </Button>
        </div>


        {/* Analyze Button */}
        {preview && !isAnalyzing && (
          <Button
            size="lg"
            className="w-full py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up mb-8"
            onClick={handleAnalyze}
          >
            <CheckCircle className="mr-2 h-5 w-5" />
            {t("step2Title")}
          </Button>
        )}

        {/* Prediction Summary */}
        {prediction && !isAnalyzing && (
          <div className="mb-8 p-6 rounded-lg border border-primary/30 bg-primary/5 animate-fade-in">
            <h2 className="text-xl font-bold mb-2 text-primary">Prediction Summary</h2>
            <div className="mb-2">
              <span className="font-semibold">Disease:</span> {language === "rw" ? prediction.diseaseRw : prediction.disease}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Confidence:</span> {(prediction.confidence * 100).toFixed(1)}%
            </div>
            <div className="mb-2">
              <span className="font-semibold">Severity:</span> {prediction.severity}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Recommendation:</span> {language === "rw" ? prediction.treatment.actionRw : prediction.treatment.action}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Estimated Cost:</span> {prediction.treatment.cost}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Other Possible Diseases:</span>
              <ul className="list-disc ml-6">
                {prediction.allPredictions && Object.entries(prediction.allPredictions).map(([disease, conf]) => (
                  <li key={disease}>{disease}: {(conf * 100).toFixed(1)}%</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="space-y-3 animate-slide-up">
          <div className="flex items-start gap-3 rounded-lg bg-blue-50 border border-blue-200 p-4">
            <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-blue-900 text-sm">Pro Tips for Best Results:</p>
              <p className="text-sm text-blue-800 mt-1">{t("uploadTip")}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 bg-primary rounded-full"></span>
              Take clear photos in good lighting
            </p>
            <p className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 bg-primary rounded-full"></span>
              Include affected leaf areas in the frame
            </p>
            <p className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 bg-primary rounded-full"></span>
              Avoid shadows and reflections on the leaf
            </p>
          </div>
        </div>

        {/* Hidden File Inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </main>
  );
};

export default UploadPage;
