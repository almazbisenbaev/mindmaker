import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { updateProfileAction } from "./actions"

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
      <form
        className="flex-1 flex flex-col w-full max-w-md gap-4"
        action={updateProfileAction}
      >
        <div>
          <label className="text-sm" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            name="username"
            defaultValue={profile?.username || ''}
            className="w-full p-2 border rounded-md"
            placeholder="Enter username"
          />
        </div>
        <div>
          <label className="text-sm" htmlFor="avatar">
            Avatar Image
          </label>
          {profile?.avatar_url && (
            <img
              src={profile.avatar_url}
              alt="Current avatar"
              className="w-20 h-20 rounded-full mb-2"
            />
          )}
          <input
            id="avatar"
            name="avatar"
            type="file"
            accept="image/*"
            className="w-full p-2 border rounded-md"
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-white p-2 rounded-md"
        >
          Update Profile
        </button>
      </form>
    </div>
  )
}