import css from "./Header.module.css";
import Link from "next/link";

import AuthNavigation from "../AuthNavigation/AuthNavigation";

export default function Header() {
  return (
    <header className={css.header}>
      <Link className={css.navigationLink} href="/" aria-label="Home">
        NoteHub
      </Link>
      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li>
            <Link className={css.navigationLink} href="/">
              Home
            </Link>
          </li>
          <AuthNavigation />
        </ul>
      </nav>
    </header>
  );
}
