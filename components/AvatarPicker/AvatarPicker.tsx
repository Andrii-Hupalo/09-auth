"use client";

import { ChangeEvent, useState } from "react";
import Image from "next/image";
import css from "./AvatarPicker.module.css";

type Props = {
  onChangePhoto: (file: File | null) => void;
  profilePhotoUrl?: string;
};

const AvatarPicker = ({ profilePhotoUrl, onChangePhoto }: Props) => {
  const [previewUrl, setPreviewUrl] = useState<string>(profilePhotoUrl || "");
  const [error, setError] = useState<string>("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError("");

    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Only images");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Max file size 5MB");
        return;
      }

      onChangePhoto(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    onChangePhoto(null);
    setPreviewUrl("");
  };

  return (
    <div className={css.pickerContainer}>
      <div className={css.picker}>
        {previewUrl && (
          <Image
            src={previewUrl}
            alt="Avatar Preview"
            width={150}
            height={150}
            className={css.avatar}
            priority
          />
        )}
        <label
          className={previewUrl ? `${css.wrapper} ${css.reload}` : css.wrapper}
        >
          <span className={css.icon}>📷</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={css.input}
          />
        </label>
        {previewUrl && (
          <button className={css.remove} onClick={handleRemove} type="button">
            ❌
          </button>
        )}
      </div>
      {error && <p className={css.error}>{error}</p>}
    </div>
  );
};

export default AvatarPicker;
