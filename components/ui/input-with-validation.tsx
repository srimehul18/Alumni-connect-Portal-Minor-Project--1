"use client"

import type * as React from "react"
import { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { CheckCircle2, AlertCircle } from "lucide-react"

export interface ValidationRule {
  test: (value: string) => boolean
  message: string
}

interface InputWithValidationProps extends Omit<React.ComponentProps<typeof Input>, "onChange"> {
  label?: string
  required?: boolean
  hint?: string
  validationRules?: ValidationRule[]
  onChange?: (value: string, isValid: boolean) => void
  showValidationState?: boolean
}

export function InputWithValidation({
  label,
  required,
  hint,
  validationRules = [],
  onChange,
  showValidationState = true,
  className,
  ...props
}: InputWithValidationProps) {
  const [value, setValue] = useState("")
  const [touched, setTouched] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const validateValue = useCallback(
    (val: string) => {
      const newErrors = validationRules.filter((rule) => !rule.test(val)).map((rule) => rule.message)
      setErrors(newErrors)
      return newErrors.length === 0
    },
    [validationRules],
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value
    setValue(newValue)
    const isValid = validateValue(newValue)
    onChange?.(newValue, isValid)
  }

  const handleBlur = () => {
    setTouched(true)
    validateValue(value)
  }

  const hasError = touched && errors.length > 0
  const isValid = touched && errors.length === 0 && value.length > 0

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-foreground flex items-center gap-1">
          {label}
          {required && <span className="text-destructive">*</span>}
        </label>
      )}

      <div className="relative">
        <Input
          {...props}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn(
            "transition-all duration-200",
            hasError && "border-destructive focus-visible:ring-destructive/30",
            isValid && showValidationState && "border-success focus-visible:ring-success/30",
            className,
          )}
          aria-invalid={hasError}
        />

        {showValidationState && (
          <>
            {isValid && (
              <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-success animate-in-scale" />
            )}
            {hasError && (
              <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-destructive animate-in-scale" />
            )}
          </>
        )}
      </div>

      {hint && !hasError && (
        <p className="text-xs text-muted-foreground flex items-center gap-1 animate-in-up">{hint}</p>
      )}

      {hasError && (
        <div className="space-y-1 animate-in-up">
          {errors.map((error, idx) => (
            <p key={idx} className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3 shrink-0" />
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
