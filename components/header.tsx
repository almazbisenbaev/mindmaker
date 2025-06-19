import * as React from "react"
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils"

import { Menu, CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react"

import HeaderAuth from "@/components/header-auth";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"





export default function Header() {
  return (
    <nav className="w-full border-b border-b-foreground/10">
      <div className="container mx-auto px-4 text-sm">
        <div className="flex items-center justify-between py-4">
          
          {/* Logo */}
          <Link href={"/"} className="flex-shrink-0">
            <Image 
              src="/images/logo.svg" 
              width={120} 
              height={34}
              alt="Mindmaker"
            />
          </Link>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex flex-1 justify-center">

            {/* <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/dashboard" passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Dashboard
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/about" passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      About Mindmaker
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/blog" passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      What's new?
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu> */}

            <NavigationMenu>
              <NavigationMenuList>

                {/* <NavigationMenuItem>
                  <NavigationMenuTrigger>Home</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                            href="/"
                          >
                            <div className="mt-4 mb-2 text-lg font-medium">
                              shadcn/ui
                            </div>
                            <p className="text-muted-foreground text-sm leading-tight">
                              Beautifully designed components built with Tailwind CSS.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <ListItem href="/docs" title="Introduction">
                        Re-usable components built using Radix UI and Tailwind CSS.
                      </ListItem>
                      <ListItem href="/docs/installation" title="Installation">
                        How to install dependencies and structure your app.
                      </ListItem>
                      <ListItem href="/docs/primitives/typography" title="Typography">
                        Styles for headings, paragraphs, lists...etc
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem> */}

                {/* <NavigationMenuItem>
                  <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {components.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem> */}

                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/dashboard">Dashboard</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/new">New analysis</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/blog">What's new?</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem> */}

                {/* <NavigationMenuItem>
                  <NavigationMenuTrigger>Learn</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[300px] gap-4 py-2">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link href="#">
                            <div className="px-6 py-2">
                              <div className="font-medium">What is SWOT Analysis</div>
                              <div className="text-muted-foreground">Get a clear picture of where your business stands internally and how it fits into the market</div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link href="#">
                            <div className="px-6 py-2">
                              <div className="font-medium">What is Lean Canvas</div>
                              <div className="text-muted-foreground">Quickly map out and validate your business idea before building anything</div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link href="#">
                            <div className="px-6 py-2">
                              <div className="font-medium">What is PESTEL Analysis</div>
                              <div className="text-muted-foreground">Understand how external forces might impact your business strategy or operations</div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem> */}

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Examples</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[300px] gap-4 py-2">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link target="_blank" href="/doc/4b770e6d-063c-4ddf-a2bf-fa24d2bb6723">
                            <div className="px-6 py-2">
                              <div className="font-medium">OpenAI SWOT Analysis</div>
                              {/* <div className="text-muted-foreground">Get a clear picture of where your business stands internally and how it fits into the market</div> */}
                            </div>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link target="_blank" href="/doc/28be7ff0-db36-4c7e-8093-17510cc1fd02">
                            <div className="px-6 py-2">
                              <div className="font-medium">Airbnb Lean Canvas</div>
                              {/* <div className="text-muted-foreground">Quickly map out and validate your business idea before building anything</div> */}
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* <NavigationMenuItem>
                  <NavigationMenuTrigger>Examples</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-4">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link href="#">Components</Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link href="#">Documentation</Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link href="#">Blocks</Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem> */}

                {/* <NavigationMenuItem>
                  <NavigationMenuTrigger>With Icon</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-4">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link href="#" className="flex-row items-center gap-2">
                            <CircleHelpIcon />
                            Backlog
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link href="#" className="flex-row items-center gap-2">
                            <CircleIcon />
                            To Do
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link href="#" className="flex-row items-center gap-2">
                            <CircleCheckIcon />
                            Done
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem> */}

              </NavigationMenuList>
            </NavigationMenu>

          </div>

          {/* Right side: HeaderAuth + Mobile menu */}
          <div className="flex items-center gap-2 sm:gap-4">
            <HeaderAuth />
            
            {/* Mobile Menu Dropdown - Only visible on mobile */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10 focus-visible:ring-0 focus-visible:ring-offset-0">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">

                  {/* <DropdownMenuLabel>Menu</DropdownMenuLabel> */}

                  {/* <DropdownMenuSeparator /> */}

                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="w-full">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuLabel>Examples</DropdownMenuLabel>

                  <DropdownMenuItem asChild>
                    <Link href="/doc/4b770e6d-063c-4ddf-a2bf-fa24d2bb6723" className="w-full">
                      OpenAI SWOT Analysis
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/doc/28be7ff0-db36-4c7e-8093-17510cc1fd02" className="w-full">
                      Airbnb Lean Canvas
                    </Link>
                  </DropdownMenuItem>

                  {/* <NavigationMenuItem>
                    <NavigationMenuTrigger>List</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[300px] gap-4">
                        <li>
                          <NavigationMenuLink asChild>
                            <Link href="#">
                              <div className="font-medium">Components</div>
                              <div className="text-muted-foreground">
                                Browse all components in the library.
                              </div>
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link href="#">
                              <div className="font-medium">Documentation</div>
                              <div className="text-muted-foreground">
                                Learn how to use the library.
                              </div>
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link href="#">
                              <div className="font-medium">Blog</div>
                              <div className="text-muted-foreground">
                                Read our latest blog posts.
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem> */}

                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}




function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}

ListItem.displayName = "ListItem"

