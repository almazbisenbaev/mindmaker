'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { z } from 'zod'

const documentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  template: z.string().min(1, 'Template is required')
})

type DocumentFormData = z.infer<typeof documentSchema>

export default function DocumentForm() {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema)
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
        <label htmlFor="title" className="block text-sm font-medium">
          Title
        </label>
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
        <label htmlFor="description" className="block text-sm font-medium">
          Description (optional)
        </label>
        <textarea
          {...register('description')}
          id="description"
          className="w-full p-2 border rounded-md"
          rows={3}
          placeholder="Enter document description"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="template" className="block text-sm font-medium">
          Template
        </label>
        <select
          {...register('template')}
          id="template"
          className="w-full p-2 border rounded-md"
        >
          <option value="">Select a template</option>
          <option value="swot">SWOT Analysis</option>
          <option value="lean">Lean Canvas</option>
        </select>
        {errors.template && (
          <p className="text-sm text-red-500">{errors.template.message}</p>
        )}
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