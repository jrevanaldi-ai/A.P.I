export function LuneLogo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      {/* White L with modern API Reference style font */}
      <text
        x="50"
        y="72"
        fontSize="80"
        fontWeight="700"
        fill="currentColor"
        textAnchor="middle"
        fontFamily="'Courier New', 'Monaco', monospace"
        letterSpacing="-3"
      >
        L
      </text>
    </svg>
  );
}

export function LuneWordmark() {
  return (
    <div className="flex items-center gap-2">
      <div className="text-white">
        <LuneLogo size={40} />
      </div>
      <div>
        <div className="text-xl font-bold tracking-tight">
          Lune<span className="text-[#00bc96]">.</span>Api
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">REST API Platform</div>
      </div>
    </div>
  );
}
