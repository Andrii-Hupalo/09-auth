"use client";

import { useRouter } from "next/navigation";
import css from "./AuthNavigation.module.css";
import { useUserAuthStore } from "@/lib/store/authStore";
import Link from "next/link";
import { logoutUser } from "@/lib/api/clientApi";

export default function AuthNavigation() {
  const router = useRouter();
  const { isAuthenticated, user, clearIsAuthenticated } = useUserAuthStore();

  const handleLogout = async () => {
    try {
      await logoutUser();
      clearIsAuthenticated();
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {isAuthenticated ? (
        <>
          <li className={css.navigationItem}>
            <Link
              href="/profile"
              prefetch={false}
              className={css.navigationLink}
            >
              Profile
            </Link>
          </li>

          <li className={css.navigationItem}>
            <Link
              href="/notes/filter/all"
              prefetch={false}
              className={css.navigationLink}
            >
              Notes
            </Link>
          </li>

          <li className={css.navigationItem}>
            <p className={css.userEmail}>{user?.email}</p>
            <button onClick={handleLogout} className={css.logoutButton}>
              Logout
            </button>
          </li>
        </>
      ) : (
        <>
          <li className={css.navigationItem}>
            <Link
              href="/sign-in"
              prefetch={false}
              className={css.navigationLink}
            >
              Login
            </Link>
          </li>

          <li className={css.navigationItem}>
            <Link
              href="/sign-up"
              prefetch={false}
              className={css.navigationLink}
            >
              Sign up
            </Link>
          </li>
        </>
      )}
    </>
  );
}
