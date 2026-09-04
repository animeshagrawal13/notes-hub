import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const VARIANT: Record<ButtonVariant, string> = {
  primary: "bg-sage-600 text-white hover:bg-sage-700 border border-transparent",
  secondary: "bg-elevated text-ink border border-border hover:border-sage-300 hover:bg-sage-50",
  tertiary: "bg-transparent text-secondary border border-transparent hover:text-ink hover:bg-sage-50",
  danger: "bg-transparent border border-border text-[color:var(--danger)] hover:bg-[color:var(--tint-terracotta)]",
};

const SIZE: Record<ButtonSize, string> = {
  sm: "h-[34px] px-3 text-meta gap-1.5",
  md: "h-10 px-4 text-body gap-2",
  lg: "h-[44px] px-5 text-body-lg gap-2",
};

export function buttonClasses(variant: ButtonVariant = "secondary", size: ButtonSize = "md", className?: string) {
  return cn(
    "inline-flex items-center justify-center rounded-button font-semibold whitespace-nowrap",
    "transition duration-calm ease-calm active:translate-y-px disabled:opacity-60 disabled:pointer-events-none",
    VARIANT[variant],
    SIZE[size],
    className
  );
}

export function Button({
  children,
  variant = "secondary",
  size = "md",
  className,
  ...rest
}: {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

export function LinkButton({
  children,
  href,
  variant = "secondary",
  size = "md",
  className,
}: {
  children: ReactNode;
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  return (
    <Link href={href} className={buttonClasses(variant, size, className)}>
      {children}
    </Link>
  );
}

export default Button;
