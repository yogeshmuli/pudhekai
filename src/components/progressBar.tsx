import React from "react";

type ProgressBarProps = {
    percent: number;
    barClass?: string;
    labelClass?: string;
};

export default function ProgressBar({
    percent,
    barClass = "bg-primary",
    labelClass = "text-primary",
}: ProgressBarProps) {
    return (
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4 relative">
            <div
                className={`${barClass} h-3 rounded-full transition-all duration-500`}
                style={{ width: `${percent}%` }}
            ></div>
            {/* <span
                className={`absolute top-[-28px] font-semibold text-sm  ${labelClass} hidden sm:inline`}
                style={{ left: `calc(${percent}% - 24px)` }}
            >
                {percent}%
            </span> */}
        </div>
    );
}