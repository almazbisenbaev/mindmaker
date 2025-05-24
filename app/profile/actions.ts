'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

export async function updateProfileAction(formData: FormData) {
  const supabase = await createClient()
  const user = (await supabase.auth.getUser()).data.user

  if (!user) {
    return redirect('/sign-in')
  }

  try {
    // Log initial form data
    console.log('Form data received:', {
      username: formData.get('username'),
      hasAvatarFile: formData.has('avatar')
    })
    
    const username = formData.get('username') as string
    const avatarFile = formData.get('avatar') as File
    
    // First, let's verify if the profiles table exists and if the user has a record
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    console.log('Existing profile check:', { 
      profile: existingProfile, 
      error: profileCheckError,
      userId: user.id 
    })

    console.log('Avatar file details:', { 
      name: avatarFile.name,
      size: avatarFile.size,
      type: avatarFile.type 
    })
    let avatarUrl = null

    if (avatarFile.size > 0) {
      console.log('Starting avatar upload process...')
      // Step 1: Get current profile
      const { data: currentProfile, error: profileError } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single()
      
      console.log('Current profile:', { currentProfile, error: profileError })

      // Step 2: Delete old avatar if exists
      if (currentProfile?.avatar_url) {
        console.log('Found existing avatar, preparing to delete:', currentProfile.avatar_url)
        const oldAvatarPath = currentProfile.avatar_url.split('/avatars/')[1]
        if (oldAvatarPath) {
          console.log('Attempting to delete old avatar at path:', oldAvatarPath)
          const { error: deleteError } = await supabase
            .storage
            .from('avatars')
            .remove([oldAvatarPath])

          if (deleteError) {
            console.error('Failed to delete old avatar:', deleteError)
            return redirect('/profile?message=Failed to update avatar - please try again')
          }
          console.log('Successfully deleted old avatar')
        }
      }

      // Step 3: Upload new avatar
      const fileExt = avatarFile.name.split('.').pop()
      const fileName = `${user.id}/${uuidv4()}.${fileExt}`
      console.log('Preparing to upload new avatar:', { fileName })

      const { error: uploadError, data: uploadData } = await supabase
        .storage
        .from('avatars')
        .upload(fileName, avatarFile, {
          cacheControl: '3600',
          upsert: true
        })

      console.log('Upload result:', { uploadError, uploadData })
      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase
        .storage
        .from('avatars')
        .getPublicUrl(fileName)

      console.log('Generated public URL:', publicUrl)
      avatarUrl = publicUrl
    }

    // Step 4: Update profile
    const updatePayload = {
      username,
      ...(avatarUrl && { avatar_url: avatarUrl }),
      updated_at: new Date().toISOString(),
    }
    console.log('Updating profile with payload:', { 
      updatePayload,
      userId: user.id,
      tableExists: !!(await supabase.from('profiles').select('count').single())
    })

    // If profile doesn't exist, create it
    if (!existingProfile) {
      console.log('No existing profile found, creating new profile')
      const { error: insertError, data: insertData } = await supabase
        .from('profiles')
        .insert([{ 
          id: user.id,
          ...updatePayload
        }])
        .select()
      console.log('Profile creation result:', { error: insertError, data: insertData })
      if (insertError) throw insertError
    } else {
      // Update existing profile
      const { error, data: updateData } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', user.id)
        .select()

      console.log('Profile update result:', { 
        error, 
        updateData,
        updatePayload 
      })
      if (error) throw error
    }

    // Verify the update
    const { data: verifyProfile, error: verifyError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    console.log('Final profile verification:', {
      profile: verifyProfile,
      error: verifyError
    })

    return redirect('/profile?message=Profile updated successfully')
  } catch (error) {
    console.error('Error updating profile:', error)
    return redirect('/profile?message=Error updating profile')
  }
}