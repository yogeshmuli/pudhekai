import Link from "next/link";
import { SolidButton, TextButton } from "@app/components/buttons";
import Image from "next/image";

export default function LandingHeader() {
    return (
        <header className="h-[72px] bg-gradient-to-r from-primary to-[#1cc3aa] flex items-center justify-between px-8 shadow-md w-full">
            {/* Left: Logo/Text */}
            <div className="flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2 group" aria-label="Go to landing page">
                    <div className="bg-white rounded-xl p-1 flex items-center justify-center shadow-sm">
                        <Image src="/logo-icon.svg" alt="PudheKai Logo" width={36} height={36} className="h-9 w-9" priority />
                    </div>
                    <span className="text-2xl font-bold font-size-[1.5rem] text-white">
                        <span className="text-white">PudheK</span><span className="text-gray-100">ai</span>
                    </span>
                </Link>
            </div>
            {/* Right: Buttons */}
            <div className="flex items-center gap-4">
                <TextButton href="/login">Login</TextButton>
                <SolidButton href="/register">Sign Up</SolidButton>
            </div>
        </header>
    );
}