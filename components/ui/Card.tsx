import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
}

export default function Card({ children, hover = false, className = "", ...props }: CardProps) {
  return (
    <div
      className={`
        bg-[--cs-bg-card]
        border border-[--cs-border]
        rounded-2xl
        p-6
        cs-shadow-soft
        ${hover ? "transition-all duration-200 hover:-translate-y-0.5 hover:cs-shadow-card" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
