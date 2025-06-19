import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <div className="container mx-auto py-24">

      <div className="flex flex-col gap-8 items-center max-w-3xl mx-auto text-center mb-8">
        <h1 className="font-bold text-8xl tracking-tighter">Visualize Your Business Model in Minutes</h1>
        <div className="text-xl font-medium">Create, analyze, and share business frameworks to make better decisions and drive growth</div>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center gap-8">

        <Image
            src="/images/illustration-homepage.png"
            width="1040"
            height="440"
            className="object-contain block w-full"
            alt=""
        />

        <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-1"></div>

        <Button asChild>
          <Link href="/sign-up">
            Get Started
          </Link>
        </Button>

      </div>
      
    </div>
  );
}
