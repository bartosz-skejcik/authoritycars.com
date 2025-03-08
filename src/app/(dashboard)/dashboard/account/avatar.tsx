/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { toast } from "sonner";

export default function Avatar({
  uid,
  url,
  size,
  onUpload,
}: {
  uid: string | null;
  url: string | null;
  size: number;
  onUpload: (url: string) => void;
}) {
  const supabase = createClient();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(url);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage
          .from("avatars")
          .download(path);
        if (error) {
          throw error;
        }

        const url = URL.createObjectURL(data);
        setAvatarUrl(url);
      } catch (error) {
        console.log("Error downloading image: ", error);
      }
    }

    if (url) downloadImage(url);
  }, [url, supabase.storage]);

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (
    event,
  ) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${uid}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Call onUpload with the new file path
      onUpload(filePath);

      toast.success("Avatar uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error uploading avatar!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div style={{ width: size }}>
        <label className="button primary block" htmlFor="single">
          {avatarUrl ? (
            <Image
              width={size}
              height={size}
              src={avatarUrl}
              alt="Avatar"
              className="avatar image cursor-pointer rounded-xl"
              style={{ height: size, width: size }}
            />
          ) : (
            <div
              className="avatar no-image cursor-pointer overflow-hidden rounded-xl"
              style={{ height: size, width: size }}
            >
              <img
                src="https://www.svgrepo.com/show/508699/landscape-placeholder.svg"
                alt="placeholder"
              />
            </div>
          )}
        </label>
        <input
          style={{
            visibility: "hidden",
            position: "absolute",
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  );
}
