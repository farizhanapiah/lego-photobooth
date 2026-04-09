"use client";

interface SurveyCardProps {
  questionNumber: number;
  question: string;
  options: readonly string[];
  selectedOption: string | null;
  onSelect: (option: string) => void;
}

const numberColors = [
  "bg-[var(--lego-red)]",
  "bg-[var(--lego-blue)]",
  "bg-[var(--leaf-green)]",
];

export default function SurveyCard({ questionNumber, question, options, selectedOption, onSelect }: SurveyCardProps) {
  return (
    <div className="bg-white/95 rounded-[16px] lg:rounded-[20px] p-4 md:p-5 lg:p-6 shadow-[0_4px_20px_rgba(29,29,27,0.08)]">
      <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
        <span className={`w-[30px] h-[30px] md:w-[36px] md:h-[36px] lg:w-[40px] lg:h-[40px] rounded-full flex items-center justify-center text-white font-[family-name:var(--font-fredoka-var)] font-bold text-[14px] md:text-[17px] lg:text-[20px] ${numberColors[(questionNumber - 1) % numberColors.length]}`}>
          {questionNumber}
        </span>
        <h3 className="font-[family-name:var(--font-fredoka-var)] font-bold text-[16px] md:text-[20px] lg:text-[26px] text-[var(--lego-black)]">
          {question}
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-2 md:gap-3">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onSelect(option)}
            className={`px-3 md:px-4 lg:px-5 py-2.5 md:py-3 lg:py-4 rounded-[16px] lg:rounded-[24px] font-[family-name:var(--font-nunito-var)] font-bold text-[14px] md:text-[18px] lg:text-[22px] text-[var(--lego-black)] transition-all duration-200 min-h-[44px] md:min-h-[52px] lg:min-h-[64px] ${
              selectedOption === option
                ? "bg-[var(--lego-yellow)] border-2 lg:border-3 border-[var(--lego-black)] shadow-[0_2px_0_var(--lego-black)]"
                : "bg-[var(--off-white)] border-2 lg:border-3 border-transparent"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
