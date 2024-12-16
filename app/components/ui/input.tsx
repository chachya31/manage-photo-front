import * as React from 'react'

import { cn } from '~/libs/utils'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        className={cn(
          "input input-bordered w-full",
          className,
        )}
        ref={ref}
        type={type}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }