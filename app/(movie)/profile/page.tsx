"use client";
import { useState, useEffect } from "react";
import { updateProfile, signInWithEmailAndPassword, updatePassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Save, X, User as UserIcon, UploadCloud, Mail, Lock, LogIn, User } from "lucide-react";
import { auth, db } from "@/app/firebase";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import axios from "axios"; 
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from "next/navigation";
import * as z from "zod";

const passwordSchema = z.object({
  oldPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[@$!%*?&]/, "Password must contain at least one special character"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export default function ProfilePage() {
  const router = useRouter();
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
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        setProfile({
          displayName: user.displayName || "",
          photoURL: user.photoURL || "",
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "displayName" && !/^[a-zA-Z0-9]*$/.test(value)) {
      return;
    }

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
    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    try {
      setPasswordErrors({});

      const validationResult = passwordSchema.safeParse({
        oldPassword,
        newPassword,
        confirmPassword
      });

      if (!validationResult.success) {
        const errors = validationResult.error.flatten().fieldErrors;
        setPasswordErrors({
          oldPassword: errors.oldPassword?.[0],
          newPassword: errors.newPassword?.[0],
          confirmPassword: errors.confirmPassword?.[0]
        });
        return;
      }

      const credential = await signInWithEmailAndPassword(auth, user.email!, oldPassword);
      
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
      router.refresh();
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Sign-out failed:", error);
      toast.error("Sign-out failed");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center bg-gradient-to-r from-indigo-500 to-blue-600 text-white py-8">
            <Lock className="mx-auto mb-4" size={48} />
            <CardTitle className="text-3xl">Access Your Profile</CardTitle>
            <p className="text-white/80 mt-2">Sign in to view and manage your account</p>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center text-gray-600">
                <User className="mr-3 text-indigo-500" />
                <p>Personalize your experience</p>
              </div>
              <div className="flex items-center text-gray-600">
                <Lock className="mr-3 text-indigo-500" />
                <p>Secure access to your account</p>
              </div>
            </div>
            
            <Link href="/login" className="block mt-6">
              <Button className="w-full" variant="default">
                <LogIn className="mr-2" /> Log In to Your Account
              </Button>
            </Link>
            
            <div className="text-center mt-4">
              <p className="text-sm text-gray-500">
                Don't have an account? 
                <Link href="/signup" className="text-indigo-600 hover:underline ml-1">
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Profile Settings</h2>
          {isEditing ? (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                className="bg-white/20 hover:bg-white/30 text-white"
              >
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="bg-white text-indigo-600 hover:bg-gray-100"
              >
                <Save className="mr-2 h-4 w-4" /> {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          ) : (
            <Button 
              onClick={() => setIsEditing(true)}
              className="bg-white/20 hover:bg-white/30 text-white"
            >
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Button>
          )}
        </div>

        <div className="p-8 space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32 border-4 border-indigo-200 shadow-lg">
              <AvatarImage src={profile.photoURL} />
              <AvatarFallback className="text-4xl bg-indigo-100 text-indigo-600">
                {profile.displayName ? profile.displayName.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>

            {isEditing && (
              <label className="cursor-pointer flex flex-col items-center gap-2">
                <UploadCloud className="h-6 w-6 text-indigo-500" />
                <span className="text-sm text-gray-600">
                  {uploading ? "Uploading..." : "Upload New Image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <UserIcon className="mr-2 text-indigo-500" size={20} />
                <p className="text-gray-500 text-sm">Username</p>
              </div>
              {isEditing ? (
                <Input
                  name="displayName"
                  value={profile.displayName}
                  onChange={handleInputChange}
                  placeholder="Enter username"
                  className="mt-1"
                />
              ) : (
                <p className="text-lg font-semibold text-gray-800">
                  {profile.displayName || "Not set"}
                </p>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Mail className="mr-2 text-indigo-500" size={20} />
                <p className="text-gray-500 text-sm">Email</p>
              </div>
              <p className="text-lg font-semibold text-gray-800">
                {user.email}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Lock className="mr-2 text-indigo-500" size={20} />
                <p className="text-gray-500 text-sm">Password</p>
              </div>
              {changingPassword ? (
                <div className="space-y-2">
                  <Input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                    className={`mt-1 ${passwordErrors.oldPassword ? 'border-red-500' : ''}`}
                  />
                  {passwordErrors.oldPassword && (
                    <p className="text-red-500 text-sm">{passwordErrors.oldPassword}</p>
                  )}

                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className={`mt-2 ${passwordErrors.newPassword ? 'border-red-500' : ''}`}
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-red-500 text-sm">{passwordErrors.newPassword}</p>
                  )}

                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className={`mt-2 ${passwordErrors.confirmPassword ? 'border-red-500' : ''}`}
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-red-500 text-sm">{passwordErrors.confirmPassword}</p>
                  )}

                  <div className="flex gap-2 mt-2">
                    <Button 
                      onClick={handlePasswordUpdate} 
                      className="bg-indigo-500 text-white"
                    >
                      Update Password
                    </Button>
                    <Button 
                      onClick={() => {
                        setChangingPassword(false);
                        setPasswordErrors({});
                      }}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-lg font-semibold text-gray-800">********</p>
                  <Button 
                    onClick={() => setChangingPassword(true)} 
                    className="mt-2 bg-indigo-500 text-white"
                  >
                    Change Password
                  </Button>
                </>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
              <p className="text-gray-500 text-sm">Want to sign out?</p>
              <Button 
                onClick={handleSignOut}
                variant="destructive"
                className="ml-4"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}