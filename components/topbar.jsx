"use client";

import React from "react";
import { useState } from "react";
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
  const [active, setActive] = useState(null);

  return (
    <Navbar isBordered maxWidth="2xl" classNames={{item: ["data-[active=true]:after:bg-primary, data-[active=true]:after:font-bold"]}}>
      <NavbarContent justify="start" className="w-full flex-grow">
        <NavbarBrand className="mr-4 pr-20">
          <img src='/logo.svg' className="h-12 w-30" alt="MovieRadar" />
          <a className="hidden sm:block font-bold text-inherit text-2xl" href='/'>MovieRadar</a>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-3 space-x-4">
          <NavbarItem isActive={active === 'Home'}>
            <Link color="foreground" href="/" onClick={() => setActive('Home')}>
              Home 🏠
            </Link>
          </NavbarItem>
          <NavbarItem isActive={active === 'Faves'}>
            <Link href="/library" aria-current="page" color="foreground" onClick={() => setActive('Faves')}>
            Favourites ❤️
            </Link>
          </NavbarItem>
          <NavbarItem isActive={active === 'Friends'}>
            <Link color="foreground" href="#" onClick={() => setActive('Friends')}>
              Friends 🫂
            </Link>
          </NavbarItem>
          <NavbarItem isActive={active === 'ForYou'}>
            <Link color="foreground" href="#" onClick={() => setActive('ForYou')}>
              For You 🔥
            </Link>
          </NavbarItem>
          <NavbarItem isActive={active === 'About'}>
            <Link color="foreground" href="#" onClick={() => setActive('About')}>
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