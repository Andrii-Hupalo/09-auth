import React from "react";
import css from "./LayoutNotes.module.css";

type Props = {
  sidebar: React.ReactNode;
  children: React.ReactNode;
};

export default function FilterLayout({ sidebar, children }: Props) {
  return (
    <section className={css.container}>
      <aside className={css.sidebar}>{sidebar}</aside>
      <main className={css.notesWrapper}>{children}</main>
    </section>
  );
}
