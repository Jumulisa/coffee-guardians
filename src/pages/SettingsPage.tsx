import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, Bell, Shield, Languages, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { updateUserSettings } from "@/lib/db-service";

const SettingsPage = () => {
  const { user, logout, updateProfile } = useAuth();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateProfile({
        full_name: formData.full_name,
      });
      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLanguageChange = async (newLanguage: "en" | "rw") => {
    try {
      setLanguage(newLanguage);
      if (user) {
        await updateUserSettings(user.id, { language: newLanguage });
      }
    } catch (error) {
      console.error("Error updating language preference:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] px-4 py-12 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        {/* Profile Section */}
        <Card className="mb-6 border-0 shadow-lg animate-slide-up">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Profile Information
            </CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Success Message */}
              {successMessage && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                  {successMessage}
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="px-4 py-2 bg-gray-50 rounded-lg text-foreground font-medium">
                    {formData.full_name || "Not set"}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <div className="px-4 py-2 bg-gray-50 rounded-lg text-muted-foreground">
                  {formData.email}
                </div>
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="flex-1"
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button 
                      onClick={handleSave} 
                      className="flex-1"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          full_name: user?.full_name || "",
                          email: user?.email || "",
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card className="mb-6 border-0 shadow-lg animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Security
            </CardTitle>
            <CardDescription>Manage your security settings</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div>
                <p className="font-semibold text-green-900">Password</p>
                <p className="text-sm text-green-800">Last changed 30 days ago</p>
              </div>
              <Button variant="outline" size="sm">
                Change Password
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div>
                <p className="font-semibold text-blue-900">Two-Factor Authentication</p>
                <p className="text-sm text-blue-800">Not enabled</p>
              </div>
              <Button variant="outline" size="sm">
                Enable 2FA
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Section */}
        <Card className="mb-6 border-0 shadow-lg animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>Manage notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-sm font-medium text-foreground">Disease alerts</span>
            </label>
            <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-sm font-medium text-foreground">Weekly reports</span>
            </label>
            <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm font-medium text-foreground">Product recommendations</span>
            </label>
          </CardContent>
        </Card>

        {/* Language Section */}
        <Card className="mb-6 border-0 shadow-lg animate-slide-up" style={{ animationDelay: "0.25s" }}>
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5 text-primary" />
              Language
            </CardTitle>
            <CardDescription>Choose your preferred language</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
              <input 
                type="radio" 
                name="language"
                value="en"
                checked={language === "en"}
                onChange={(e) => handleLanguageChange(e.target.value as "en" | "rw")}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-foreground">English</span>
            </label>
            <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
              <input 
                type="radio" 
                name="language"
                value="rw"
                checked={language === "rw"}
                onChange={(e) => handleLanguageChange(e.target.value as "en" | "rw")}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-foreground">Kinyarwanda (Icyarwanda)</span>
            </label>
          </CardContent>
        </Card>

        {/* Privacy Section */}
        <Card className="mb-6 border-0 shadow-lg animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Privacy
            </CardTitle>
            <CardDescription>Manage your privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-sm font-medium text-foreground">Make diagnosis history private</span>
            </label>
            <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm font-medium text-foreground">Allow data sharing for research</span>
            </label>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-0 shadow-lg border-red-200 bg-red-50 animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <CardHeader className="border-b border-red-200">
            <CardTitle className="text-red-900">Danger Zone</CardTitle>
            <CardDescription className="text-red-800">Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            <Button variant="outline" className="w-full text-destructive border-destructive hover:bg-destructive/5">
              Download My Data
            </Button>
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleLogout}
            >
              Logout
            </Button>
            <Button variant="outline" className="w-full text-destructive border-destructive hover:bg-destructive/5">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default SettingsPage;
