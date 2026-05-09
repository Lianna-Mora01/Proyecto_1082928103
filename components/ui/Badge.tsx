import React from "react";

type BadgeVariant = "primary" | "secondary" | "alert" | "error" | "success";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: "bg-(--cs-primary) text-white",
  secondary: "bg-(--cs-secondary) text-(--cs-text-primary)",
  alert: "bg-(--cs-alert) text-white",
  error: "bg-(--cs-error) text-white",
  success: "bg-(--cs-success) text-white",
};

export default function Badge({
  variant = "primary",
  children,
  className = "",
  ...props
}: BadgeProps) {
  return (
    <span
      className={`
        inline-block
        px-3 py-1
        rounded-full
        text-sm
        font-medium
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
}
