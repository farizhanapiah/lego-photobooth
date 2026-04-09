"use client";

import { useState } from "react";

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onDone: () => void;
  showEmailKeys?: boolean;
}

const ROW_1 = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
const ROW_2 = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
const ROW_3 = ["z", "x", "c", "v", "b", "n", "m"];

const keyBase =
  "bg-white rounded-[8px] lg:rounded-[12px] border-2 border-[var(--lego-black)] shadow-[0_2px_0_var(--lego-black)] lg:shadow-[0_3px_0_var(--lego-black)] active:shadow-[0_1px_0_var(--lego-black)] active:translate-y-[1px] lg:active:translate-y-[2px] font-[family-name:var(--font-nunito-var)] font-bold text-[16px] lg:text-[24px] text-[var(--lego-black)] transition-all duration-100 flex items-center justify-center h-[44px] lg:h-[64px]";

export default function VirtualKeyboard({
  onKeyPress,
  onBackspace,
  onDone,
  showEmailKeys = false,
}: VirtualKeyboardProps) {
  const [isUpperCase, setIsUpperCase] = useState(false);
  const [showNumbers, setShowNumbers] = useState(false);

  const NUM_ROW_1 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  const NUM_ROW_2 = ["@", "#", "$", "%", "&", "*", "-", "+", "(", ")"];
  const NUM_ROW_3 = ["!", '"', "'", ":", ";", "/", "?", ",", "."];

  const handleKey = (key: string) => {
    onKeyPress(isUpperCase ? key.toUpperCase() : key);
    if (isUpperCase) setIsUpperCase(false);
  };

  const renderKey = (key: string, extraClass = "", display?: string) => (
    <button
      key={key}
      onClick={() => handleKey(key)}
      className={`${keyBase} flex-1 ${extraClass}`}
    >
      {display || (isUpperCase ? key.toUpperCase() : key)}
    </button>
  );

  if (showNumbers) {
    return (
      <div className="w-full bg-[var(--off-white)] border-t-3 border-[#D0D0D0] px-2 lg:px-4 pt-2 pb-3">
        <div className="flex gap-[4px] lg:gap-[6px] mb-[4px] lg:mb-[6px]">
          {NUM_ROW_1.map((k) => renderKey(k))}
        </div>
        <div className="flex gap-[4px] lg:gap-[6px] mb-[4px] lg:mb-[6px]">
          {NUM_ROW_2.map((k) => renderKey(k))}
        </div>
        <div className="flex gap-[4px] lg:gap-[6px] mb-[4px] lg:mb-[6px]">
          {NUM_ROW_3.map((k) => renderKey(k))}
        </div>
        <div className="flex gap-[4px] lg:gap-[6px]">
          <button onClick={() => setShowNumbers(false)} className={`${keyBase} min-w-[60px] lg:min-w-[140px] !bg-[var(--lego-blue)] !text-white text-[14px] lg:text-[20px]`}>ABC</button>
          {renderKey(".")}
          <button onClick={() => onKeyPress(" ")} className={`${keyBase} flex-[3] text-[14px] lg:text-[20px]`}>SPACE</button>
          <button onClick={onBackspace} className={`${keyBase} min-w-[50px] lg:min-w-[120px] !bg-[var(--brick-orange)] !text-white text-[16px] lg:text-[20px]`}>&#9003;</button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[var(--off-white)] border-t-3 border-[#D0D0D0] px-2 lg:px-4 pt-2 pb-3">
      <div className="flex gap-[4px] lg:gap-[6px] mb-[4px] lg:mb-[6px]">
        {ROW_1.map((k) => renderKey(k))}
      </div>
      <div className="flex gap-[4px] lg:gap-[6px] mb-[4px] lg:mb-[6px] px-[3%]">
        {ROW_2.map((k) => renderKey(k))}
      </div>
      <div className="flex gap-[4px] lg:gap-[6px] mb-[4px] lg:mb-[6px]">
        <button
          onClick={() => setIsUpperCase(!isUpperCase)}
          className={`${keyBase} min-w-[40px] lg:min-w-[100px] ${isUpperCase ? "!bg-[var(--lego-blue)] !text-white" : "!bg-[#D0D0D0]"} text-[16px] lg:text-[22px]`}
        >&#8679;</button>
        {ROW_3.map((k) => renderKey(k))}
        <button onClick={onBackspace} className={`${keyBase} min-w-[40px] lg:min-w-[100px] !bg-[var(--brick-orange)] !text-white text-[16px] lg:text-[22px]`}>&#9003;</button>
      </div>
      <div className="flex gap-[4px] lg:gap-[6px]">
        <button onClick={() => setShowNumbers(true)} className={`${keyBase} min-w-[40px] lg:min-w-[100px] !bg-[#D0D0D0] text-[14px] lg:text-[20px]`}>123</button>
        {showEmailKeys && (
          <>
            {renderKey("@")}
            {renderKey(".")}
          </>
        )}
        <button onClick={() => onKeyPress(" ")} className={`${keyBase} flex-[3] text-[14px] lg:text-[20px]`}>SPACE</button>
        {showEmailKeys && (
          <button onClick={() => onKeyPress(".com")} className={`${keyBase} min-w-[50px] lg:min-w-[120px] !bg-[var(--lego-yellow)] !text-[var(--lego-black)] text-[14px] lg:text-[20px]`}>.com</button>
        )}
        <button onClick={onDone} className={`${keyBase} min-w-[50px] lg:min-w-[120px] !bg-[var(--leaf-green)] !text-white text-[14px] lg:text-[20px]`}>DONE</button>
      </div>
    </div>
  );
}
