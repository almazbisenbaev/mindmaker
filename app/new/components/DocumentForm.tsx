'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
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
import { TemplateCard } from './TemplateCard'

const documentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  template: z.string().min(1, 'Template is required'),
  status: z.enum(['private', 'public'])
})

type DocumentFormData = z.infer<typeof documentSchema>

export default function DocumentForm() {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting }, control, setValue, watch } = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      template: 'swot',
      status: 'private'
    }
  })
  const watchTemplate = watch('template', 'swot')

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
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl mx-auto space-y-4">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <TemplateCard
            id="swot"
            name="SWOT Analysis"
            description="Analyze strengths, weaknesses, opportunities, and threats"
            icon="/images/thumb-swot.jpg"
            isSelected={watchTemplate === 'swot'}
            onSelect={(id) => setValue('template', id)}
          />
          <TemplateCard
            id="lean"
            name="Lean Canvas"
            description="Visualize your business model and strategy"
            icon="/images/thumb-lean.jpg"
            isSelected={watchTemplate === 'lean'}
            onSelect={(id) => setValue('template', id)}
          />
          <TemplateCard
            id="pestel"
            name="PESTEL Analysis"
            description="Analyze external macro-environmental factors"
            icon="/images/thumb-pestel.jpg"
            isSelected={watchTemplate === 'pestel'}
            onSelect={(id) => setValue('template', id)}
          />
          <TemplateCard
            id="porters"
            name="Porter’s Five Forces"
            description="Analyze industry competition and market forces"
            icon="/images/thumb-swot.jpg"
            isSelected={watchTemplate === 'porters'}
            onSelect={(id) => setValue('template', id)}
          />
        </div>
        {errors.template && (
          <p className="text-sm text-red-500">{errors.template.message}</p>
        )}
      </div>

      {/* <div className="space-y-2">
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
      </div> */}

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