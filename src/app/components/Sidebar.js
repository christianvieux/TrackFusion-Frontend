"use client";

import Link from "next/link";
import { Heart, Home, ListTodo, Music } from "lucide-react";
import { usePathname } from "next/navigation";

import TrackListQueue from "./TrackListQueue";
import TrackFusionWebIcon from "./Icons/TrackFusionWebIcon";

/* -------------------- */
/* DATA                 */
/* -------------------- */

const NAV_ITEMS = [
  { label: "Home",              icon: Home,     href: "/home"            },
  { label: "Feed",              icon: ListTodo, href: "/feed"            },
  { label: "My Tracks",         icon: Music,    href: "/myTracks"        },
  { label: "My Favorite Tracks",icon: Heart,    href: "/myFavoriteTracks"},
];

/* -------------------- */
/* SUBCOMPONENTS        */
/* -------------------- */

/** Horizontal rule with a centered label — used for section dividers */
function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-2 px-2">
      <p className="shrink-0 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
        {children}
      </p>
    </div>
  );
}

/** Single nav link — pill active state (A), purple icon tint when inactive (B) */
function SidebarLink({ item, isActive }) {
  const Icon = item.icon;

  return (
    <li>
      <Link
        href={item.href}
        aria-current={isActive ? "page" : undefined}
        className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
          isActive
            ? "bg-primary/15 text-primary"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
        }`}
      >
        <Icon
          className={`size-5 shrink-0 transition-colors ${
            isActive
              ? "text-primary"
              : "text-accent group-hover:text-foreground"
          }`}
        />
        <span className="whitespace-nowrap">{item.label}</span>

        {/* Active left-bar accent (from B) */}
        {isActive && (
          <span className="ml-auto h-4 w-0.5 rounded-full bg-primary" />
        )}
      </Link>
    </li>
  );
}

/* -------------------- */
/* SIDEBAR              */
/* -------------------- */

export default function Sidebar({ className = "", classNames = {}, ...props }) {
  const pathname = usePathname();
  const isActive = (href) => pathname.toLowerCase() === href.toLowerCase();

  return (
    <aside
      id="sidebar"
      aria-label="Main navigation"
      className={`flex h-screen w-60 flex-col overflow-y-auto border-r border-accent/20 bg-background/70 backdrop-blur-lg backdrop-saturate-150 ${className}`}
      {...props}
    >
      {/* Logo */}
      <div className={`px-4 py-5 ${classNames.logo || ""}`}>
        <Link href="/home" className="block">
          <TrackFusionWebIcon className="h-7 w-auto text-foreground" />
        </Link>
      </div>

      {/* Nav */}
      <section className="flex flex-col gap-3 px-3 pb-4">
        <SectionLabel>Quick Links</SectionLabel>
        <nav>
          <ul className="space-y-0.5">
            {NAV_ITEMS.map((item) => (
              <SidebarLink key={item.href} item={item} isActive={isActive(item.href)} />
            ))}
          </ul>
        </nav>
      </section>

      {/* Queue — grows to fill remaining space, recessed card style (Option A) */}
      <section className="mx-3 mb-4 hidden flex-1 flex-col gap-3 overflow-hidden rounded-xl bg-secondary p-3 md:flex">
        <SectionLabel>Track Queue</SectionLabel>
        <div className="min-h-0 flex-1 overflow-hidden">
          <TrackListQueue className="h-full" />
        </div>
      </section>
    </aside>
  );
}