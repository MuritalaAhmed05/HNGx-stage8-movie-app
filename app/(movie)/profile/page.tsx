"use client";

import { useState, useEffect } from "react";
import { updateProfile, signInWithEmailAndPassword, updatePassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Save, X, User as UserIcon, UploadCloud, Mail, Lock, LogIn, LogOut, Shield, Palette } from "lucide-react";
import { useThemeAccent, ACCENTS, AccentColor } from "@/components/ThemeAccentContext";
import { auth, db } from "@/app/firebase";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import * as z from "zod";

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ProfilePage() {
  const router = useRouter();
  const { accent, setAccent } = useThemeAccent();
  const [user, setUser] = useState(auth.currentUser);
  const [profile, setProfile] = useState({
    displayName: "",
    photoURL: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [changingPassword, setChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<{
    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setProfile({
          displayName: currentUser.displayName || "",
          photoURL: currentUser.photoURL || "",
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/deltdoijc/image/upload",
        formData
      );

      setProfile((prev) => ({ ...prev, photoURL: response.data.secure_url }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      await updateProfile(user, {
        displayName: profile.displayName,
        photoURL: profile.photoURL,
      });

      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { updatedAt: new Date() }, { merge: true });

      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!user || !user.email) {
      toast.error("User not authenticated");
      return;
    }

    try {
      setPasswordErrors({});

      const validationResult = passwordSchema.safeParse({
        oldPassword,
        newPassword,
        confirmPassword,
      });

      if (!validationResult.success) {
        const errors = validationResult.error.flatten().fieldErrors;
        setPasswordErrors({
          oldPassword: errors.oldPassword?.[0],
          newPassword: errors.newPassword?.[0],
          confirmPassword: errors.confirmPassword?.[0],
        });
        return;
      }

      const credential = await signInWithEmailAndPassword(auth, user.email, oldPassword);
      await updatePassword(credential.user, newPassword);

      toast.success("Password updated successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setChangingPassword(false);
    } catch (error) {
      console.error("Password update failed:", error);
      toast.error("Re-authentication failed. Please check your current password.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Sign-out failed:", error);
      toast.error("Sign-out failed");
    }
  };

  if (!user) {
    return (
      <div className="min-h-[85vh] bg-[#0b0f19] flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass-card border-white/10 text-white p-6 space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
              <Lock size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gradient">Account Required</h2>
            <p className="text-sm text-gray-400">
              Sign in to manage your profile, security, and favorite watchlists.
            </p>
          </div>
          <CardContent className="p-0 pt-4 space-y-4">
            <Link href="/login" className="block">
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-600/30">
                Log In <LogIn className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <div className="text-center">
              <p className="text-xs text-gray-400">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-red-400 hover:underline font-semibold">
                  Sign Up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] bg-[#0b0f19] text-gray-100 py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-2xl glass-card rounded-2xl border border-white/15 shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="bg-slate-900/90 border-b border-white/10 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="text-red-500" size={22} />
            <h2 className="text-xl font-bold text-white">Profile & Account Settings</h2>
          </div>
          {isEditing ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
                className="glass-button text-gray-300 rounded-lg text-xs"
              >
                <X className="mr-1 h-3.5 w-3.5" /> Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving}
                className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs"
              >
                <Save className="mr-1 h-3.5 w-3.5" /> {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={() => setIsEditing(true)}
              className="glass-button text-gray-200 hover:text-white rounded-lg text-xs"
            >
              <Pencil className="mr-1 h-3.5 w-3.5" /> Edit Profile
            </Button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-8 space-y-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-3">
            <Avatar className="h-28 w-28 border-2 border-red-500/60 shadow-xl">
              <AvatarImage src={profile.photoURL} />
              <AvatarFallback className="text-3xl bg-red-950 text-red-400 font-bold">
                {profile.displayName ? profile.displayName.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>

            {isEditing && (
              <label className="cursor-pointer flex items-center gap-2 text-xs font-semibold text-red-400 hover:text-red-300">
                <UploadCloud size={16} />
                <span>{uploading ? "Uploading..." : "Upload New Avatar"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Form Fields Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900/60 border border-white/10 p-4 rounded-xl space-y-2">
              <div className="flex items-center text-xs font-semibold text-gray-400">
                <UserIcon className="mr-2 text-red-500" size={16} />
                <span>Display Username</span>
              </div>
              {isEditing ? (
                <Input
                  name="displayName"
                  value={profile.displayName}
                  onChange={handleInputChange}
                  placeholder="Enter username"
                  className="bg-slate-950 border-white/20 text-white text-xs"
                />
              ) : (
                <p className="text-sm font-semibold text-white">
                  {profile.displayName || "Not set"}
                </p>
              )}
            </div>

            <div className="bg-slate-900/60 border border-white/10 p-4 rounded-xl space-y-2">
              <div className="flex items-center text-xs font-semibold text-gray-400">
                <Mail className="mr-2 text-red-500" size={16} />
                <span>Email Address</span>
              </div>
              <p className="text-sm font-semibold text-white truncate">{user.email}</p>
            </div>
          </div>

          {/* Theme Accent Color Customizer */}
          <div className="bg-slate-900/60 border border-white/10 p-5 rounded-xl space-y-3">
            <div className="flex items-center text-xs font-semibold text-gray-400">
              <Palette className="mr-2 text-red-500" size={16} />
              <span>UI Accent Color Theme</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              {(Object.keys(ACCENTS) as AccentColor[]).map((key) => {
                const item = ACCENTS[key];
                const isSelected = accent === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setAccent(key);
                      toast.success(`Theme set to ${item.name}!`);
                    }}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all text-xs font-bold ${
                      isSelected
                        ? "bg-white/10 border-white/40 text-white shadow-lg"
                        : "bg-slate-950/60 border-white/10 text-gray-400 hover:text-white hover:border-white/20"
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full flex-shrink-0 shadow-md"
                      style={{ backgroundColor: item.primary }}
                    />
                    <span className="truncate">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Password Change Block */}
          <div className="bg-slate-900/60 border border-white/10 p-5 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs font-semibold text-gray-400">
                <Lock className="mr-2 text-red-500" size={16} />
                <span>Password Security</span>
              </div>
              {!changingPassword && (
                <button
                  onClick={() => setChangingPassword(true)}
                  className="text-xs font-semibold text-red-400 hover:underline"
                >
                  Change Password
                </button>
              )}
            </div>

            {changingPassword && (
              <div className="space-y-3 pt-2">
                <div>
                  <Input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Current password"
                    className="bg-slate-950 border-white/20 text-white text-xs"
                  />
                  {passwordErrors.oldPassword && (
                    <p className="text-red-400 text-[11px] mt-1">{passwordErrors.oldPassword}</p>
                  )}
                </div>

                <div>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password (min 8 chars)"
                    className="bg-slate-950 border-white/20 text-white text-xs"
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-red-400 text-[11px] mt-1">{passwordErrors.newPassword}</p>
                  )}
                </div>

                <div>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="bg-slate-950 border-white/20 text-white text-xs"
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-red-400 text-[11px] mt-1">{passwordErrors.confirmPassword}</p>
                  )}
                </div>

                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    onClick={handlePasswordUpdate}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
                  >
                    Update Password
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setChangingPassword(false);
                      setPasswordErrors({});
                    }}
                    className="glass-button text-gray-300 text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Sign Out CTA Bar */}
          <div className="pt-2 flex items-center justify-between border-t border-white/10">
            <p className="text-xs text-gray-400">Finished your session?</p>
            <Button
              onClick={handleSignOut}
              variant="destructive"
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <LogOut size={14} /> Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}