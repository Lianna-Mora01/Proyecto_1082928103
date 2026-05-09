import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`
        bg-(--cs-bg-card) 
        border border-(--cs-border)
        rounded-lg
        p-6
        shadow-sm
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
