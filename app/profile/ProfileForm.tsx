'use client';

import { useState } from 'react';
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ProfileFormProps {
  initialProfile: {
    username?: string;
    avatar_url?: string;
  };
  userId: string;
}

export function ProfileForm({ initialProfile, userId }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(initialProfile?.avatar_url);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const username = formData.get('username') as string;
      const avatarFile = formData.get('avatar') as File;
      const supabase = createClient();
      
      let avatarUrl = initialProfile?.avatar_url;

      // Show in-progress toast
      const toastId = toast.loading('Updating profile...');

      if (avatarFile.size > 0) {
        try {
          // Delete old avatar if exists
          if (initialProfile?.avatar_url) {
            const oldAvatarPath = initialProfile.avatar_url.split('/avatars/')[1];
            if (oldAvatarPath) {
              const { error: deleteError } = await supabase.storage
                .from('avatars')
                .remove([oldAvatarPath]);
              
              if (deleteError) {
                console.warn('Error deleting old avatar:', deleteError);
                // Continue anyway as this is not critical
              }
            }
          }

          // Upload new avatar
          const fileExt = avatarFile.name.split('.').pop();
          const fileName = `${userId}/${Date.now()}.${fileExt}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, avatarFile, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            toast.error('Error uploading avatar: ' + uploadError.message, { id: toastId });
            throw uploadError;
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);
            
          avatarUrl = publicUrl;
        } catch (error) {
          console.error('Avatar upload error:', error);
          toast.error('Failed to upload avatar', { id: toastId });
          return;
        }
      }

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          username: username || null,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id'
        });

      if (updateError) {
        console.error('Profile update error:', updateError);
        toast.error('Error updating profile: ' + updateError.message, { id: toastId });
        throw updateError;
      }

      toast.success('Profile updated successfully', { id: toastId });
      setAvatarPreview(avatarUrl);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  return (
    <form
      className="flex-1 flex flex-col w-full max-w-md gap-4"
      onSubmit={handleSubmit}
    >
      <div>
        <Label className="text-sm" htmlFor="username">
          Username
        </Label>
        <Input
          id="username"
          name="username"
          defaultValue={initialProfile?.username || ''}
          className="w-full p-2 border rounded-md"
          placeholder="Enter username"
          disabled={isSubmitting}
        />
      </div>
      <div>
        <Label className="text-sm" htmlFor="avatar">
          Avatar Image
        </Label>
        {avatarPreview && (
          <img
            src={avatarPreview}
            alt="Avatar preview"
            className="w-20 h-20 rounded-full mb-2"
          />
        )}
        <Input
          id="avatar"
          name="avatar"
          type="file"
          accept="image/*"
          className="w-full p-2 border rounded-md"
          onChange={handleAvatarChange}
          disabled={isSubmitting}
        />
      </div>
      <Button
        type="submit"
        className="bg-primary text-white p-2 rounded-md"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Updating Profile...' : 'Update Profile'}
      </Button>
    </form>
  );
}
