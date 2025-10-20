"use client";
import React, { useEffect, useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "../ui/input2";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { getPhotoUrlAction, updateProfileAction } from "@/app/(inner_routes)/profile/[slug]/actions";
import { toast } from "sonner";
import { useProfileUserStore } from "@/store";
import { useSession } from "next-auth/react";

export default function EditProfile() {
  const [files, setFiles] = useState<File[]>([]);
  const { user, setUser } = useProfileUserStore();
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    image: "",
  });

  const session = useSession();

  useEffect(() => {
    setProfile({
      name: user?.name || "",
      bio: user?.bio || "",
      image: user?.image || "",
    });
  }, []);

  const handleFileUpload = async (files: File[]) => {
    setFiles(files);
    console.log(files);

    try {
      // Get the photo URL from cloudinary
      const formData = new FormData();
      formData.append("file", files[0]);
      const photoUrl = await getPhotoUrlAction(formData);
      console.log("Photo URL: ", photoUrl);
      toast.success("Photo uploaded successfully");

      setProfile({ ...profile, image: photoUrl });
    } catch (error) {
      console.log(error);
      toast.error("Failed to upload photo");
    }
  };

  const updateProfile = async () => {
    try {
      const updatedUser = await updateProfileAction(profile, session?.data?.user?.id!);
      if(updatedUser) {
        setUser(updatedUser);
        toast.success("Profile updated successfully");
      } else {
        toast.error("Error updating profile");
      }
    } catch (error) {
      console.log("Error", error);
      toast.error("Error updating profile");
    }
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-center text-lg mb-2">
        Update Profile Picture
      </h2>
      <div className="w-full mx-auto border border-dashed bg-gray-300 dark:bg-zinc-950 border-neutral-200 dark:border-neutral-800 rounded-lg">
        <FileUpload onChange={handleFileUpload} />
      </div>
      <h2 className="text-center text-lg mt-8 mb-2">Update Name</h2>
      <Input
        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
        value={profile.name}
        className="dark:bg-zinc-950 border-zinc-400 dark:border-zinc-700 active:border-none"
        type="text"
        placeholder="Name"
      />

      <h2 className="text-center text-lg mt-8 mb-2">Update Bio</h2>
      <Textarea
        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
        value={profile.bio}
        className="dark:bg-zinc-950 border-zinc-400 dark:border-zinc-700 focus-visible:ring-0"
        placeholder="Enter bio"
      />

      <Button onClick={updateProfile} className="dark:bg-zinc-950 border-zinc-400 dark:border-zinc-700 mt-10 mb-20 w-60" variant={"outline"}>
        Update
      </Button>
    </div>
  );
}
