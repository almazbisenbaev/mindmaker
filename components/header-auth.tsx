import { signOutAction } from "@/app/actions";
// import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, avatar_url')
    .eq('id', user?.id)
    .single();

  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 h-auto p-2 focus-visible:ring-0 focus-visible:ring-offset-0">
          {profile?.avatar_url && (
            <img 
              src={profile.avatar_url}
              alt="Avatar"
              className="w-7 h-7 rounded-full object-cover"
            />
          )}
          <span className="hidden md:inline">{profile?.username || user.email}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/profile">My profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <form action={signOutAction}>
            <button type="submit" className="w-full text-left">
              Log out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}

export default AuthButton;

// import { signOutAction } from "@/app/actions";
// import { hasEnvVars } from "@/utils/supabase/check-env-vars";
// import Link from "next/link";
// import { Badge } from "./ui/badge";
// import { Button } from "./ui/button";
// import { createClient } from "@/utils/supabase/server";

// async function AuthButton() {
//   const supabase = await createClient();

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   const { data: profile } = await supabase
//     .from('profiles')
//     .select('username, avatar_url')
//     .eq('id', user?.id)
//     .single();

//   return user ? (
//     <div className="flex items-center gap-4">
//       {profile?.avatar_url && (
//         <img 
//           src={profile.avatar_url}
//           alt="Avatar"
//           className="w-8 h-8 rounded-full"
//         />
//       )}
//       Hey, {profile?.username || user.email}!
//       <form action={signOutAction}>
//         <Button type="submit" variant={"outline"}>
//           Sign out
//         </Button>
//       </form>
//     </div>
//   ) : (
//     <div className="flex gap-2">
//       <Button asChild size="sm" variant={"outline"}>
//         <Link href="/sign-in">Sign in</Link>
//       </Button>
//       <Button asChild size="sm" variant={"default"}>
//         <Link href="/sign-up">Sign up</Link>
//       </Button>
//     </div>
//   );
// }

// export default AuthButton;