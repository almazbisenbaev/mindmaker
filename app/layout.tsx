import * as React from "react"
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import Image from "next/image";

import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";

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


const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">

            <div className="flex-1 w-full flex flex-col gap-20 items-center">

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
                          {/* <NavigationMenuItem>
                            <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
                            <NavigationMenuContent>
                              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                <li className="row-span-3">
                                  <NavigationMenuLink asChild>
                                    <a
                                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                      href="/"
                                    >
                                      <div className="mb-2 mt-4 text-lg font-medium">
                                        shadcn/ui
                                      </div>
                                      <p className="text-sm leading-tight text-muted-foreground">
                                        Beautifully designed components built with Radix UI and
                                        Tailwind CSS.
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
                          </NavigationMenuItem> */}
                          {/* <NavigationMenuItem>
                            <Link href="/docs" legacyBehavior passHref>
                              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                Documentation
                              </NavigationMenuLink>
                            </Link>
                          </NavigationMenuItem> */}
                        </NavigationMenuList>
                      </NavigationMenu>
                    </div>

                    <HeaderAuth />

                  </div>
                </div>
              </nav>

              <div className="flex flex-col gap-20 max-w-5xl p-5">
                {children}
              </div>

              <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
                <p>
                  Powered by{" "}
                  <a
                    href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                    target="_blank"
                    className="font-bold hover:underline"
                    rel="noreferrer"
                  >
                    Supabase
                  </a>
                </p>
                <ThemeSwitcher />
              </footer>
            </div>

          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
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