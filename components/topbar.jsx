import React from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Input, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar} from "@nextui-org/react";
import {SearchIcon} from "./SearchIcon.jsx";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import Search from './search';

const Topbar = () => {
  return (
    <Navbar isBordered maxWidth="2xl">
      <NavbarContent justify="start" className="w-full flex-grow">
        <NavbarBrand className="mr-4 pr-20">
          <img src='/logo.svg' className="h-12 w-30" alt="MovieRadar" />
          <a className="hidden sm:block font-bold text-inherit text-2xl" href='/'>MovieRadar</a>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-3 space-x-4">
          <NavbarItem>
            <Link color="foreground" href="#">
              Home 🏠
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link href="/library" aria-current="page" color="secondary">
            Favourites ❤️
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="#">
              Friends 🫂
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="#">
              For You 🔥
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="#">
              About 🧐
            </Link>
          </NavbarItem>
        </NavbarContent>
      </NavbarContent>

      <NavbarContent as="div" className="items-center" justify="end">
      <Search />
      <div className="flex items-center justify-center space-x-4 md:space-x-8 rtl:space-x-reverse">
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton className="border-2 border-gray-300 rounded-full px-4 py-2" />
        </SignedOut>
      </div>
    </NavbarContent>
    </Navbar>
  );
}

export default Topbar;