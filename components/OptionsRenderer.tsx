"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import type { OptionField, OptionSchema } from "@/lib/registry"

interface OptionsRendererProps {
  schema: OptionSchema
  values: Record<string, any>
  onChange: (key: string, value: any) => void
  className?: string
}

export function OptionsRenderer({ schema, values, onChange, className }: OptionsRendererProps) {
  const renderField = (field: OptionField) => {
    const value = values[field.key] ?? field.default

    switch (field.type) {
      case "number":
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            <Input
              id={field.key}
              type="number"
              value={value}
              onChange={(e) => onChange(field.key, Number(e.target.value))}
              min={field.min}
              max={field.max}
              step={field.step}
              placeholder={field.placeholder}
              required={field.required}
            />
            {field.helpText && (
              <p className="text-xs text-muted-foreground">{field.helpText}</p>
            )}
          </div>
        )

      case "range":
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>
              {field.label}: {value}
            </Label>
            <Slider
              value={[value]}
              onValueChange={([v]) => onChange(field.key, v)}
              min={field.min ?? 0}
              max={field.max ?? 100}
              step={field.step ?? 1}
            />
            <Input
              id={field.key}
              type="number"
              value={value}
              onChange={(e) => onChange(field.key, Number(e.target.value))}
              min={field.min}
              max={field.max}
              step={field.step}
              className="mt-2"
            />
            {field.helpText && (
              <p className="text-xs text-muted-foreground">{field.helpText}</p>
            )}
          </div>
        )

      case "checkbox":
        return (
          <div key={field.key} className="flex items-center space-x-2">
            <Switch
              id={field.key}
              checked={value}
              onCheckedChange={(checked) => onChange(field.key, checked)}
            />
            <Label htmlFor={field.key}>{field.label}</Label>
            {field.helpText && (
              <span className="text-xs text-muted-foreground ml-2">({field.helpText})</span>
            )}
          </div>
        )

      case "select":
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            <Select
              value={String(value)}
              onValueChange={(v) => {
                // Try to convert to number if all options are numeric
                const numVal = Number(v)
                const isNumeric = field.options?.every(opt => !isNaN(Number(opt.value)))
                onChange(field.key, isNumeric ? numVal : v)
              }}
            >
              <SelectTrigger id={field.key}>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((opt) => (
                  <SelectItem key={String(opt.value)} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.helpText && (
              <p className="text-xs text-muted-foreground">{field.helpText}</p>
            )}
          </div>
        )

      case "multiselect":
        // For now, treat as select - can enhance later
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            <Select
              value={String(value)}
              onValueChange={(v) => onChange(field.key, v)}
            >
              <SelectTrigger id={field.key}>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((opt) => (
                  <SelectItem key={String(opt.value)} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.helpText && (
              <p className="text-xs text-muted-foreground">{field.helpText}</p>
            )}
          </div>
        )

      case "textarea":
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            <Textarea
              id={field.key}
              value={value}
              onChange={(e) => onChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              rows={4}
              required={field.required}
            />
            {field.helpText && (
              <p className="text-xs text-muted-foreground">{field.helpText}</p>
            )}
          </div>
        )

      case "text":
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            <Input
              id={field.key}
              type="text"
              value={value}
              onChange={(e) => onChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
            />
            {field.helpText && (
              <p className="text-xs text-muted-foreground">{field.helpText}</p>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={`space-y-6 ${className || ""}`}>
      {schema.fields.map(renderField)}
    </div>
  )
}
