//app/layout.js
"use client";
// .css file
import "../../public/css/global.css";
import React from "react";
import App from "./components/app.js";
import { SessionProvider } from "./context/SessionContext.js";
import { UserInfoProvider } from "./context/UserInfoContext";
import { usePathname } from "next/navigation";
import { Providers } from "./components/Providers/NextUI_Provider.js";

const css_routes = {
  "/home": ["/css/home.css", "/css/shooting_stars.css"],
  "/feed": ["/css/feed.css"],
  "/mytracks": ["/css/myTracks.css"],
  "/myfavoritetracks": ["/css/myFavoriteTracks.css"],
};

const MAINTENANCE_MODE = true;


export default function RootLayout({
  children, // will be a page or nested layout
}) {
  const pathname = usePathname().toLowerCase();

  // If in maintenance mode and not accessing the maintenance page, redirect to maintenance
  if (MAINTENANCE_MODE && pathname !== "/maintenance") {
    if (typeof window !== "undefined") {
      window.location.href = "/maintenance";
      return null;
    }
  }

  const matchedRoute = Object.keys(css_routes).find((route) =>
    pathname.startsWith(route)
  );
  const cssFiles = css_routes[matchedRoute] || ["/css/default.css"];

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {cssFiles.map((route) => (
          <link key={route} rel="stylesheet" href={route} />
        ))}
      </head>
      <body
        className={`h-screen bg-green-darkest 
         
        `}
      >
        <Providers>
          <SessionProvider>
            <UserInfoProvider>
              {MAINTENANCE_MODE ? (children) : (<App>{children}</App>)}
            </UserInfoProvider>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}
