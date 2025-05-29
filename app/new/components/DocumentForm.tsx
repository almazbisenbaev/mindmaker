'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

const documentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  template: z.string().min(1, 'Template is required'),
  status: z.enum(['private', 'public'])
})

type DocumentFormData = z.infer<typeof documentSchema>

export default function DocumentForm() {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting }, control, setValue } = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      template: 'swot',
      status: 'private'
    }
  })

  const onSubmit = async (data: DocumentFormData) => {
    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to create document')

      const document = await response.json()
      router.push(`/doc/${document.id}`)
    } catch (error) {
      console.error('Error creating document:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <input
          {...register('title')}
          id="title"
          className="w-full p-2 border rounded-md"
          placeholder="Enter document title"
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <textarea
          {...register('description')}
          id="description"
          className="w-full p-2 border rounded-md"
          rows={3}
          placeholder="Enter document description"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="template">Template</Label>
        <Select defaultValue="swot" onValueChange={(value) => setValue('template', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="swot">SWOT Analysis</SelectItem>
            <SelectItem value="lean">Lean Canvas</SelectItem>
          </SelectContent>
        </Select>
        {errors.template && (
          <p className="text-sm text-red-500">{errors.template.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Visibility</Label>
        <Select 
          defaultValue="private" 
          onValueChange={(value: 'private' | 'public') => setValue('status', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="private">Private</SelectItem>
            <SelectItem value="public">Public</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full p-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
      >
        {isSubmitting ? 'Creating...' : 'Create Document'}
      </button>
    </form>
  )
}