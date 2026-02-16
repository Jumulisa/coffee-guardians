import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Camera, Upload as UploadIcon, ImagePlus, Loader2, Lightbulb, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mockDiagnosis, saveToHistory, DiagnosisResult } from "@/lib/mock-data";

const UploadPage = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleAnalyze = useCallback(() => {
    if (!preview) return;
    setIsAnalyzing(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 30;
      });
    }, 300);

    // Simulate API call - replace with actual Flask API call
    setTimeout(() => {
      setUploadProgress(100);
      clearInterval(interval);
      const result: DiagnosisResult = {
        ...mockDiagnosis,
        id: `diag-${Date.now()}`,
        imageUrl: preview,
        date: new Date().toISOString(),
      };
      saveToHistory(result);
      setTimeout(() => {
        setIsAnalyzing(false);
        navigate("/result", { state: { result } });
      }, 500);
    }, 3000);
  }, [preview, navigate]);

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
        {preview && (
          <Button
            size="lg"
            className="w-full py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up mb-8"
            onClick={handleAnalyze}
          >
            <CheckCircle className="mr-2 h-5 w-5" />
            {t("step2Title")}
          </Button>
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
