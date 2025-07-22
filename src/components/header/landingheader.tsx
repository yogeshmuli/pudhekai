import Link from "next/link";
import { SolidButton, TextButton } from "@app/components/buttons";

export default function LandingHeader() {
    return (
        <header className="h-[72px] bg-white flex items-center justify-between px-8 shadow-sm w-full">
            {/* Left: Logo/Text */}
            <div className="text-2xl font-bold text-primary font-size-[1.5rem]">PudheKai</div>
            {/* Right: Buttons */}
            <div className="flex items-center gap-4">

                <TextButton href="/login">Login</TextButton>
                <SolidButton href="/register">Sign Up</SolidButton>
            </div>
        </header>
    );
}