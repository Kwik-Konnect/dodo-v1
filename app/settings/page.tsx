"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Id } from "@/convex/_generated/dataModel";
import { Loader2, Save, LogOut, User, Bell, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

function SettingsContent() {
  const { user, signOut, updateUser } = useAuth();
  const router = useRouter();

  const [bio, setBio] = useState(user?.profile?.bio ?? "");
  const [location, setLocation] = useState(user?.profile?.location ?? "");
  const [phone, setPhone] = useState(user?.profile?.phone ?? "");
  const [website, setWebsite] = useState(user?.profile?.website ?? "");
  const [skills, setSkills] = useState(
    (user?.profile?.skills ?? []).join(", ")
  );
  const [isSaving, setIsSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);

  const updateProfile = useMutation(api.auth.updateUserProfile);

  if (!user) return null;

  const handleSave = async () => {
    setIsSaving(true);
    setSavedOk(false);

    try {
      await updateProfile({
        userId: user.id as Id<"users">,
        profile: {
          bio,
          location,
          phone,
          website,
          skills: skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          socialLinks: user.profile?.socialLinks ?? {},
        },
      });

      updateUser({
        profile: {
          bio,
          location,
          phone,
          website,
          skills: skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          socialLinks: user.profile?.socialLinks ?? {},
        },
      });

      setSavedOk(true);
      setTimeout(() => setSavedOk(false), 3000);
    } catch (err) {
      console.error("Failed to save profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = () => {
    signOut();
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 space-y-6">
      <h1 className="text-xl font-bold text-foreground">Settings</h1>

      {/* Profile Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-4 w-4 text-primary" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Avatar display */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-border">
              <AvatarImage src={user.profile?.socialLinks?.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                {user.name[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {user.isProfessional && (
                <Badge variant="secondary" className="mt-1 text-xs">
                  Professional
                </Badge>
              )}
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell people about yourself..."
                className="resize-none"
                rows={3}
                maxLength={300}
              />
              <p className="text-xs text-muted-foreground text-right">
                {bio.length}/300
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Lagos, Nigeria"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234..."
                  type="tel"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://yoursite.com"
              type="url"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="skills">Skills / Interests</Label>
            <Input
              id="skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="Dance, Photography, Travel..."
            />
            <p className="text-xs text-muted-foreground">
              Comma-separated list of your skills or interests
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="gap-1.5 rounded-full"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </Button>
            {savedOk && (
              <span className="text-sm text-primary font-medium">
                ✓ Saved successfully
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="h-4 w-4 text-primary" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Notification preferences are managed automatically. You receive
            alerts for new messages, followers, and likes.
          </p>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4 text-primary" />
            Privacy &amp; Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-border p-3 text-sm text-muted-foreground">
            <p>
              Your data is stored securely. Only your name, bio, and public
              profile information are visible to other users. Your email and
              password are never shared.
            </p>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Sign out</p>
              <p className="text-xs text-muted-foreground">
                Sign out of your account on this device
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 rounded-full">
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Sign out?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will be signed out and redirected to the home page.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSignOut}>
                    Sign Out
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}
