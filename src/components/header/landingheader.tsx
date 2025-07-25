import Link from "next/link";
import { SolidButton, TextButton } from "@app/components/buttons";
import Image from "next/image";

export default function LandingHeader() {
    return (
        <header className="h-[72px] bg-white flex items-center justify-between px-8 shadow-sm w-full">
            {/* Left: Logo/Text */}
            <div className="flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2 group" aria-label="Go to landing page">
                    <Image src="/logo-icon.svg" alt="PudheKai Logo" width={36} height={36} className="h-9 w-9 transition-transform group-hover:scale-105" priority />
                    <span className="text-2xl font-bold font-size-[1.5rem]">
                        <span className="text-gray-700">PudheK</span><span className="text-primary">ai</span>
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