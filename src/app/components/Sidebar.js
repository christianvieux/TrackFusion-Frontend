"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Home, ListTodo, Music } from "lucide-react";
import { usePathname } from "next/navigation";
import TrackListQueue from "./TrackListQueue";

/* -------------------- */
/* DATA */
/* -------------------- */

const navigationItems = [
  {
    label: "Home",
    icon: Home,
    href: "/home",
  },
  {
    label: "Feed",
    icon: ListTodo,
    href: "/feed",
  },
  {
    label: "My Tracks",
    icon: Music,
    href: "/myTracks",
  },
  {
    label: "My Favorite Tracks",
    icon: Heart,
    href: "/myFavoriteTracks",
  },
];

/* -------------------- */
/* COMPONENTS */
/* -------------------- */

function SidebarLink({ item, isActive }) {
  const Icon = item.icon;

  return (
    <li>
      <Link
        href={item.href}
        aria-current={isActive ? "page" : undefined}
        className={`group flex items-center rounded-lg p-3 font-medium transition ${
          isActive
            ? "bg-secondary-hover text-primary"
            : "text-muted-foreground hover:bg-secondary-hover hover:text-primary"
        }`}
      >
        <Icon className="size-6 shrink-0" />
        <span className="ml-3 whitespace-nowrap">{item.label}</span>
      </Link>
    </li>
  );
}

/* -------------------- */
/* SIDEBAR */
/* -------------------- */

export default function Sidebar({
  className = "",
  classNames = {},
  ...props
}) {
  const pathname = usePathname();

  function isActiveRoute(href) {
    return pathname.toLowerCase() === href.toLowerCase();
  }

  return (
  <aside
    id="sidebar"
    aria-label="Main navigation"
    className={`flex h-screen w-64 flex-col gap-6 overflow-y-auto border-r border-accent/20 bg-background/70 px-3 py-4 backdrop-blur-lg backdrop-saturate-150 ${className}`}
    {...props}
  >
    {/* Logo */}
    <div className={`max-h-20 ${classNames.logo || ""}`}>
      <Link href="/home" className="block">
        <Image
          src="/images/TrackFusion_Title_Logo.png"
          alt="TrackFusion Logo"
          width={200}
          height={60}
          priority
        />
      </Link>
    </div>

    {/* Quick Links */}
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2 px-2">
        <div className="h-px flex-1 bg-accent/20" />

        <p className="shrink-0 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Quick Links
        </p>

        <div className="h-px flex-1 bg-accent/20" />
      </div>

      <nav>
        <ul className="space-y-1">
          {navigationItems.map((item) => (
            <SidebarLink
              key={item.href}
              item={item}
              isActive={isActiveRoute(item.href)}
            />
          ))}
        </ul>
      </nav>
    </section>

    {/* Queue */}
    <section className="hidden md:flex  min-h-0 flex-1 flex-col gap-3">
      <div className="flex items-center gap-2 px-2">
        <div className="h-px flex-1 bg-accent/20" />

        <p className="shrink-0 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Track Queue
        </p>

        <div className="h-px flex-1 bg-accent/20" />
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <TrackListQueue className="h-full" />
      </div>
    </section>
  </aside>
);
}