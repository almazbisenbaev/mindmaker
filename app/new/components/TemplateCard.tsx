'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface TemplateCardProps {
  id: string
  name: string
  description: string
  icon: string
  isSelected: boolean
  onSelect: (id: string) => void
}

export function TemplateCard({
  id,
  name,
  description,
  icon,
  isSelected,
  onSelect,
}: TemplateCardProps) {
  return (
    <Card
      className={`relative cursor-pointer transition-all hover:border-gray-300 ${
        isSelected ? 'ring ring-gray-300' : 'ring-transparent'
      }`}
      onClick={() => onSelect(id)}
    >
      <CardContent className="p-4">
        <div className="">
            <img 
              src={icon} 
              className="w-full mb-6"
            />
            <h3 className="font-medium mb-2">{name}</h3>
        </div>
        <div className="text-sm text-muted-foreground">{description}</div>
        {isSelected && (
            <Check className="w-5 h-5 text-primary absolute top-2 right-2" />
        )}
      </CardContent>
    </Card>
  )
}
