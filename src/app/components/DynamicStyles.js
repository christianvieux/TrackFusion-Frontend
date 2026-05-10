'use client';

import { usePathname } from "next/navigation";

const css_routes = {
  "/home": ["/css/home.css", "/css/shooting_stars.css"],
  "/feed": ["/css/feed.css"],
  "/mytracks": ["/css/myTracks.css"],
  "/myfavoritetracks": ["/css/myFavoriteTracks.css"],
};

export function DynamicStyles() {
  const pathname = usePathname()?.toLowerCase();
  const matchedRoute = Object.keys(css_routes).find((route) =>
    pathname?.startsWith(route)
  );
  const cssFiles = css_routes[matchedRoute] || ["/css/default.css"];

  return (
    <>
      {cssFiles.map((route) => (
        <link key={route} rel="stylesheet" href={route} />
      ))}
    </>
  );
}