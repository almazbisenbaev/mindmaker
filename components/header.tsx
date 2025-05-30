import * as React from "react"
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils"

import HeaderAuth from "@/components/header-auth";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
]


export default function Header() {

    return (
        <nav className="w-full border-b border-b-foreground/10">
            <div className="container mx-auto px-4 text-sm">
                <div className="flex items-center gap-6 py-4">

                <Link href={"/"}>
                    <Image 
                    src="/images/logo.svg" 
                    width={136} 
                    height={38}
                    alt="Mindmaker"
                    />
                </Link>

                <div className="flex-1">
                    <NavigationMenu>
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
                        <NavigationMenuItem>
                          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                          <NavigationMenuContent>
                              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
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
                        </NavigationMenuItem>
                    </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <HeaderAuth />

                </div>
            </div>
        </nav>
    )

}



const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"