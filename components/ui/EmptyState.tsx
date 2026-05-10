import React from "react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && <div className="mb-4 text-4xl">{icon}</div>}
      <h3 className="text-lg font-semibold text-[--cs-text-primary] mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-[--cs-text-secondary] mb-6 max-w-xs">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
