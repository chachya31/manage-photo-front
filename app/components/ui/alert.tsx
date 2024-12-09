import * as React from 'react'


import { cn } from '~/libs/utils'

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    className={cn("alert alert-error", className)}
    ref={ref}
    role="alert"
    {...props}
  >
    <svg
      className="h-6 w-6 shrink-0 stroke-current"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2" />
    </svg>
  </div>
))
Alert.displayName = 'Alert'


const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    ref={ref}
    {...props}
  />
))
AlertDescription.displayName = 'AlertDescription'
  

export { Alert, AlertDescription }
