import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, MapPin, Lock, Bell, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    location: user?.location || "",
    phone: user?.phone || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // TODO: Save to API
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
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
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                ) : (
                  <div className="px-4 py-2 bg-gray-50 rounded-lg text-foreground font-medium">
                    {formData.name}
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

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  District/Location
                </Label>
                {isEditing ? (
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Nyamagabe"
                  />
                ) : (
                  <div className="px-4 py-2 bg-gray-50 rounded-lg text-foreground">
                    {formData.location || "Not set"}
                  </div>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+250 7XX XXX XXX"
                  />
                ) : (
                  <div className="px-4 py-2 bg-gray-50 rounded-lg text-foreground">
                    {formData.phone || "Not set"}
                  </div>
                )}
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
                    <Button onClick={handleSave} className="flex-1">
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
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
