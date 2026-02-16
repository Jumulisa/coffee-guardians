import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Camera, Search, Stethoscope, ShieldCheck, ArrowRight, Leaf, BarChart3, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const { t } = useLanguage();

  const steps = [
    { icon: Camera, title: t("step1Title"), desc: t("step1Desc"), step: "01" },
    { icon: Search, title: t("step2Title"), desc: t("step2Desc"), step: "02" },
    { icon: Stethoscope, title: t("step3Title"), desc: t("step3Desc"), step: "03" },
  ];

  const features = [
    {
      icon: Leaf,
      title: "AI-Powered Detection",
      desc: "Advanced machine learning identifies coffee diseases instantly",
    },
    {
      icon: BarChart3,
      title: "Severity Assessment",
      desc: "Understand disease progression and treatment urgency",
    },
    {
      icon: Clock,
      title: "Quick Results",
      desc: "Get actionable recommendations in seconds",
    },
  ];

  return (
    <main className="min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground px-4 py-16 sm:py-28 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-foreground/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-foreground/5 rounded-full -ml-48 -mb-48 blur-3xl"></div>

        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 text-sm border border-primary-foreground/20 animate-fade-in">
            <ShieldCheck className="h-4 w-4" />
            {t("trustBadge")}
          </div>

          <h1 className="mb-6 text-4xl font-bold sm:text-6xl leading-tight text-balance animate-slide-down">
            {t("heroTitle")}
          </h1>

          <p className="mb-10 text-lg text-primary-foreground/90 leading-relaxed text-balance max-w-2xl mx-auto animate-slide-up">
            {t("heroSubtitle")}
          </p>

          <Link to="/upload">
            <Button
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-base px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in hover:scale-105"
            >
              <Camera className="mr-2 h-5 w-5" />
              {t("ctaButton")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-12 pt-12 border-t border-primary-foreground/20">
            <div className="text-center animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <div className="text-3xl font-bold">95%</div>
              <div className="text-sm text-primary-foreground/80">Accuracy Rate</div>
            </div>
            <div className="text-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-sm text-primary-foreground/80">Active Users</div>
            </div>
            <div className="text-center animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-sm text-primary-foreground/80">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-20 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="mb-4 text-3xl sm:text-4xl font-bold text-foreground">
              {t("howItWorks")}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Simple and straightforward process to diagnose coffee leaf diseases
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((step, index) => (
              <Card
                key={step.step}
                className="border-none shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold shadow-lg">
                    {step.step}
                  </div>
                  <step.icon className="mb-4 h-8 w-8 text-secondary" />
                  <h3 className="mb-2 text-xl font-semibold text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Connection lines */}
          <div className="hidden sm:block mt-8">
            <div className="flex justify-between px-12">
              <div className="flex-1 h-1 bg-gradient-to-r from-primary to-transparent mt-5"></div>
              <div className="flex-1 h-1 bg-gradient-to-l from-primary to-transparent mt-5"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="mb-4 text-3xl sm:text-4xl font-bold text-foreground">
              Why Choose Coffee Guardian?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Powerful features designed specifically for Rwandan coffee farmers
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border border-gray-200 hover:border-primary hover:shadow-lg transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 sm:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="mb-6 text-3xl sm:text-4xl font-bold">Ready to protect your harvest?</h2>
          <p className="mb-8 text-lg text-primary-foreground/90">
            Start diagnosing and managing coffee diseases today with AI-powered accuracy.
          </p>
          <Link to="/upload">
            <Button
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Camera className="mr-2 h-5 w-5" />
              Start Diagnosis Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Index;
