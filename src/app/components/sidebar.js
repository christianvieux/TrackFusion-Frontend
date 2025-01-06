"use client";
import React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Home, ListTodo, Music, Heart } from "lucide-react";
import Image from 'next/image';

const NAVIGATION_ITEMS = [
  {
    title: "Home",
    icon: Home,
    href: "/home"
  },
  {
    title: "Feed",
    icon: ListTodo,
    href: "/feed"
  },
  {
    title: "My Tracks",
    icon: Music,
    href: "/myTracks"
  },
  {
    title: "My Favorite Tracks",
    icon: Heart,
    href: "/myFavoriteTracks"
  }
];
  // fixed left-0 top-0 z-40 h-full w-64 -translate-x-full transition-transform sm:translate-x-0

  export default function Sidebar({ className = "", classNames={"logo": ""}, ...props }) {
    const pathname = usePathname();
  
    const isActiveRoute = (href) => {
      return pathname.toLowerCase() === href.toLowerCase();
    };
  
    return (
      <aside
        id="sidebar"
        className={`p-4 flex h-screen flex-col w-max overflow-y-auto bg-black/20 px-3 py-4 backdrop-blur-lg backdrop-saturate-150 ${className}`}
        aria-label="Main Navigation"
        {...props}
      >
        <div className={`mb-8 w-max ${classNames.logo}`}>
          <Link href="/home" className="block">
            <Image
              src="/images/TrackFusion_Title_Logo.png"
              alt="TrackFusion Logo"
              layout="intrinsic"
              width={200} // Adjust the width as necessary
              height={60} // Adjust the height as necessary
            />
          </Link>
        </div>

        <nav className="w-max">
          <ul className="space-y-2 font-medium">
            {NAVIGATION_ITEMS.map(({ title, icon: Icon, href }) => (
              <li key={title}>
                <Link
                  href={href}
                  className={`group flex items-center rounded-lg p-3 transition-colors duration-200 ${
                    isActiveRoute(href)
                      ? "bg-gray-800/50 text-pink-light"
                      : "hover:bg-gray-800/30 text-gray-light hover:text-pink-light"
                  }`}
                  aria-current={isActiveRoute(href) ? "page" : undefined}
                >
                  <Icon className="h-6 w-6 flex-shrink-0" />
                  <span className="ml-3">{title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    );
  }
