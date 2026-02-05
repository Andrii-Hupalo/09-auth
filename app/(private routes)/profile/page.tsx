import { redirect } from "next/navigation";
import css from "./ProfilePage.module.css";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { getMeServer } from "@/lib/api/serverApi";

export const metadata: Metadata = {
  title: "User profile",
  description: "Page with user profile information",
  openGraph: {
    title: "User profile",
    description: "Page with user profile information",
    url: "https://notehub.com",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "User profile",
      },
    ],
    type: "website",
  },
};
const Profile = async () => {
  const user = await getMeServer();
  if (!user) {
    redirect("/login");
  }
  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href={"/profile/edit"} className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar || "/default-avatar.svg"}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
};
export default Profile;
