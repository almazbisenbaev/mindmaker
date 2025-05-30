import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { ProfileForm } from "./ProfileForm"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/sign-in")
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex-1 w-full flex flex-col gap-6 items-center">
      <h2 className="font-bold text-2xl">Edit Profile</h2>
      <ProfileForm initialProfile={profile || {}} userId={user.id} />
    </div>
  )
}