import css from "./page.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 – Page not found | NoteHub",
  description:
    "404 error: the page you are trying to access does not exist in NoteHub.",
  openGraph: {
    title: "404 – Page not found | NoteHub",
    description:
      "404 error: the page you are trying to access does not exist in NoteHub.",
    url: "https://08-zustand-ochre-psi.vercel.app/404",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub – Page not found",
      },
    ],
  },
};

const NotFound = () => {
  return (
    <>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </>
  );
};
export default NotFound;
