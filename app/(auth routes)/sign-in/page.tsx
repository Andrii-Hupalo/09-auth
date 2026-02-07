"use client";
import css from "./SignInPage.module.css";

import { useState } from "react";

import type { LoginRequest } from "@/types/auth";

import { loginUser } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";
import { useUserAuthStore } from "@/lib/store/authStore";

export default function SignInPage() {
  const [error, setError] = useState("");
  const router = useRouter();
  const setAuthUser = useUserAuthStore((state) => state.setUser);

  const handleSubmit = async (formData: FormData) => {
    try {
      const values: LoginRequest = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      };
      const user = await loginUser(values);

      if (user) {
        setAuthUser(user);
        router.push("/profile");
      } else {
        setError("Invalid email or password.");
      }
    } catch (error) {
      setError(
        `Something went wrong. Try again.
            ERR: ${error}`,
      );
    }
  };

  return (
    <main className={css.mainContent}>
      <form action={handleSubmit} className={css.form}>
        <h1 className={css.formTitle}>Sign in</h1>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Log in
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
