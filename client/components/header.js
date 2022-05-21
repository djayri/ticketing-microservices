import React from "react";
import Link from "next/link";

export default ({ currentUser }) => {
  const links = [
    !currentUser && { label: "Sign In", href: "/auth/signin" },
    !currentUser && { label: "Sign Up", href: "/auth/signup" },
    currentUser && { label: "Sign Out", href: "/auth/signout" },
  ].reduce((filteredLinks, link) => {
    if (link) {
      const { label, href } = link;
      filteredLinks.push(
        <li key={href}>
          <Link href={href}>
            <a className="nav-link">{label}</a>
          </Link>
        </li>
      );
    }
    return filteredLinks;
  }, []);
  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">Ticketing</a>
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
};
