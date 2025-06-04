import { Button } from "./ui/button";
import Link from "next/link";


export default function Header() {
  return (
    <div className="flex flex-col gap-8 items-center py-24">

      <h1 className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">Visualize Your Business Plan in Minutes</h1>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-1" />

        <Button asChild>
          <Link href="/sign-up">
            Get Started
          </Link>
        </Button>

    </div>
  );
}
