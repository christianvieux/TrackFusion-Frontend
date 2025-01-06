"use client";
import React from "react";
import { usePathname } from "next/navigation";
import UserMenu from "./UserMenu";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from "@nextui-org/react";

export default function NavBar(
  {LeftContent, className, ...props}
) {
  const pageNames = {
    "": "Home",
    about: "About",
    contact: "Contact",
    "reset-password": "Reset Password",
    // Add other known paths here
  };
  const pathname = usePathname();
  const basePath = pathname.split("/")[1];
  const displayName =
    pageNames[basePath] || basePath.replace(/^\w/, (c) => c.toUpperCase());
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const options = {
    "Upload a track": function ({ className , ...args}) {
      return (
        <a
          href="/upload"
          className={`block rounded px-3 py-2 hover:text-pink ${className}`}
          {...args}
        >
          Upload a track
        </a>
      );
    },
    "Analyze a track": function ({ className ,...args}) {
      return (
        <a
          href="/analyze"
          className={`block rounded px-3 py-2 hover:text-pink ${className}`}
          {...args}
        >
          Analyze a track
        </a>
      );
    },
  };

  const User_Menu_Item = (<UserMenu />);

  
  return (
    <Navbar classNames={{"wrapper": "max-w-full px-2"}} className={`overflow-x-auto overflow-y-hidden bg-black/20 text-green ${className}`} onMenuOpenChange={setIsMenuOpen} {...props}>
      <NavbarContent>
        {/* Left Content */}
        {LeftContent}
        {/* Displaying which page the user is on */}
        <NavbarItem>
          <span className="flex-1 self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
            {displayName}
          </span>
        </NavbarItem>
      </NavbarContent>

      {/* Middle Content */}
      <NavbarContent className="hidden mid:flex gap-4" justify="center">
        {Object.entries(options).map(([text, Component]) => (
          <NavbarItem key={text}>
            <Component className="text-white" />
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Right Content */}
      <NavbarContent justify="end">
        {/* User Menu */}
        <NavbarItem className="">
          {User_Menu_Item}
        </NavbarItem>

        {/* Menu Toggle */}
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="mid:hidden"
        />
      </NavbarContent>

      {/* Menu Items */}
      <NavbarMenu className="sm:ml-64 w-auto bg-black/30 items-end">
        <div className="flex flex-col h-full gap-2 items-end">
          <NavbarMenuItem className="flex w-fit">
          </NavbarMenuItem>

          {Object.entries(options).map(([text, Component]) => (
            <NavbarMenuItem className="flex w-fit" key={text}>
              <Component className="text-white" />
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </Navbar>
  );
}
