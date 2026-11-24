import { clsx } from "clsx";

/** Shared TAS action styles, extracted from the existing homepage contact button. */
export function buttonStyles({ variant = "primary", className }: {
    variant?: "primary" | "secondary" | "text";
    className?: string;
} = {}) {
    return clsx(
        "inline-flex min-h-12 items-center justify-center gap-3 rounded-full font-heading font-bold transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:opacity-60",
        variant === "primary" && "bg-secondary px-8 py-4 text-lg text-dark shadow-lg",
        variant === "secondary" && "border border-primary/20 bg-white px-8 py-4 text-lg text-primary shadow-sm",
        variant === "text" && "px-3 py-3 text-base text-primary",
        className,
    );
}
