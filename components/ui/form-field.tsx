"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cn } from "@/lib/utils"
import { CheckCircle2, AlertCircle, Info } from "lucide-react"

export interface FormFieldContextValue {
  name?: string
  error?: string
  hint?: string
  success?: boolean
}

const FormFieldContext = React.createContext<FormFieldContextValue | undefined>(undefined)

function useFormField() {
  const fieldContext = React.useContext(FormFieldContext)
  if (!fieldContext) {
    return {}
  }
  return fieldContext
}

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string
  error?: string
  hint?: string
  success?: boolean
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, name, error, hint, success, ...props }, ref) => (
    <FormFieldContext.Provider value={{ name, error, hint, success }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormFieldContext.Provider>
  ),
)
FormField.displayName = "FormField"

interface FormLabelProps extends React.ComponentProps<typeof LabelPrimitive.Root> {
  required?: boolean
}

const FormLabel = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, FormLabelProps>(
  ({ className, required, ...props }, ref) => (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      {...props}
    >
      {props.children}
      {required && <span className="ml-1 text-destructive">*</span>}
    </LabelPrimitive.Root>
  ),
)
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("relative", className)} {...props} />,
)
FormControl.displayName = "FormControl"

interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  type?: "error" | "success" | "hint"
}

const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, type = "error", ...props }, ref) => {
    const { error, hint, success } = useFormField()
    const message = error || hint

    if (!message) {
      return null
    }

    const messageType = error ? "error" : hint ? "hint" : "success"

    return (
      <p
        ref={ref}
        className={cn(
          "text-sm font-medium flex items-center gap-2",
          messageType === "error" && "text-destructive",
          messageType === "hint" && "text-muted-foreground",
          messageType === "success" && "text-success",
          className,
        )}
        {...props}
      >
        {messageType === "error" && <AlertCircle className="h-4 w-4" />}
        {messageType === "success" && <CheckCircle2 className="h-4 w-4" />}
        {messageType === "hint" && <Info className="h-4 w-4" />}
        {message}
      </p>
    )
  },
)
FormMessage.displayName = "FormMessage"

export { FormField, FormLabel, FormControl, FormMessage }
