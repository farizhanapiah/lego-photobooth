"use client";

interface LegoButtonProps {
  variant?: "red" | "yellow" | "blue" | "green" | "white";
  size?: "lg" | "md";
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const variantStyles: Record<string, string> = {
  red: "bg-[var(--lego-red)] text-white",
  yellow: "bg-[var(--lego-yellow)] text-[var(--lego-black)]",
  blue: "bg-[var(--lego-blue)] text-white",
  green: "bg-[var(--leaf-green)] text-white",
  white: "bg-white text-[var(--lego-black)]",
};

export default function LegoButton({
  variant = "yellow",
  size = "lg",
  disabled = false,
  children,
  onClick,
  className = "",
}: LegoButtonProps) {
  const sizeStyles =
    size === "lg"
      ? "px-8 py-3 text-[18px] min-h-[56px] md:px-12 md:py-4 md:text-[24px] md:min-h-[64px] lg:px-16 lg:py-5 lg:text-[32px] lg:min-h-[80px]"
      : "px-6 py-3 text-[16px] min-h-[48px] md:px-10 md:py-3 md:text-[20px] md:min-h-[56px] lg:px-12 lg:py-4 lg:text-[26px] lg:min-h-[64px]";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        font-[family-name:var(--font-fredoka-var)] font-bold uppercase tracking-[0.04em]
        rounded-full
        border-3 lg:border-4 border-[var(--lego-black)]
        transition-all duration-150 ease-out
        ${variantStyles[variant]}
        ${sizeStyles}
        ${
          disabled
            ? "opacity-50 cursor-not-allowed shadow-[0_3px_0_var(--lego-black)] lg:shadow-[0_4px_0_var(--lego-black)]"
            : "shadow-[0_4px_0_var(--lego-black)] lg:shadow-[0_6px_0_var(--lego-black)] active:shadow-[0_2px_0_var(--lego-black)] active:translate-y-[2px] lg:active:translate-y-[4px] cursor-pointer"
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
}
