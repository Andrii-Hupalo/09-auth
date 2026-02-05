"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe, updateMe, uploadImage } from "@/lib/api/clientApi";
import { useUserAuthStore } from "@/lib/store/authStore";
import AvatarPicker from "@/components/AvatarPicker/AvatarPicker";
import Loading from "@/app/loading";
import css from "./EditProfilePage.module.css";

export default function EditProfile() {
  const router = useRouter();
  const { setUser } = useUserAuthStore();

  const [userName, setUserName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    getMe()
      .then((user) => {
        setUserName(user.username || "");
        setPhotoUrl(user.avatar || "");
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSaveUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      let finalPhotoUrl = photoUrl;

      if (imageFile) {
        finalPhotoUrl = await uploadImage(imageFile);
      }

      const updatedUser = await updateMe({
        userName: userName,
        photoUrl: finalPhotoUrl,
      });

      setUser(updatedUser);
      router.push("/profile");
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Update failed";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        {isLoading && <Loading />}
        <h1 className={css.formTitle}>Edit Profile</h1>

        <div className={css.avatarSection}>
          <AvatarPicker
            key={photoUrl}
            profilePhotoUrl={photoUrl}
            onChangePhoto={setImageFile}
          />
        </div>

        {error && <p className={css.error}>{error}</p>}

        <form onSubmit={handleSaveUser} className={css.profileInfo}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className={css.actions}>
            <button
              type="submit"
              className={css.saveButton}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save user"}
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={() => router.back()}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
