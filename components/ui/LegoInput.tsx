"use client";

interface LegoInputProps {
  label: string;
  value: string;
  placeholder?: string;
  error?: string;
  isFocused?: boolean;
  onFocus?: () => void;
  onChange?: (value: string) => void;
  useNativeInput?: boolean;
  type?: string;
}

export default function LegoInput({
  label,
  value,
  placeholder,
  error,
  isFocused = false,
  onFocus,
  onChange,
  useNativeInput = false,
  type = "text",
}: LegoInputProps) {
  return (
    <div className="w-full">
      <label className="block font-[family-name:var(--font-fredoka-var)] font-bold text-[16px] md:text-[20px] lg:text-[24px] tracking-[0.08em] uppercase text-white mb-1 md:mb-2">
        {label}
      </label>
      {useNativeInput ? (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={onFocus}
          className={`
            h-[52px] md:h-[60px] lg:h-[72px] w-full rounded-[12px] lg:rounded-[16px] px-4 lg:px-6
            bg-white
            font-[family-name:var(--font-nunito-var)] font-semibold text-[18px] md:text-[24px] lg:text-[32px]
            text-[var(--lego-black)]
            border-3 lg:border-4 transition-colors duration-200 outline-none
            ${
              error
                ? "border-[var(--lego-red)]"
                : "border-[#D0D0D0] focus:border-[var(--lego-blue)]"
            }
          `}
        />
      ) : (
        <div
          onClick={onFocus}
          className={`
            h-[52px] md:h-[60px] lg:h-[72px] w-full rounded-[12px] lg:rounded-[16px] px-4 lg:px-6
            bg-white
            font-[family-name:var(--font-nunito-var)] font-semibold text-[18px] md:text-[24px] lg:text-[32px]
            text-[var(--lego-black)]
            flex items-center
            border-3 lg:border-4 transition-colors duration-200
            ${
              error
                ? "border-[var(--lego-red)]"
                : isFocused
                ? "border-[var(--lego-blue)]"
                : "border-[#D0D0D0]"
            }
            cursor-text
          `}
        >
          {value ? (
            <span>{value}</span>
          ) : (
            <span className="text-[#AAAAAA]">{placeholder}</span>
          )}
          {isFocused && (
            <span className="inline-block w-[2px] lg:w-[3px] h-[24px] lg:h-[36px] bg-[var(--lego-blue)] ml-1 animate-pulse" />
          )}
        </div>
      )}
      {error && (
        <p className="mt-1 md:mt-2 text-[14px] md:text-[16px] lg:text-[18px] font-semibold text-[var(--lego-red)] font-[family-name:var(--font-nunito-var)]">
          {error}
        </p>
      )}
    </div>
  );
}
