import Link from "next/link";
import React from "react";

type ButtonProps = {
    href?: string;
    children: React.ReactNode;
    type?: "link" | "button";
    onClick?: () => void;
};

function SolidButton({ href, children, type = "link", onClick }: ButtonProps) {
    const className =
        "px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors font-medium";
    if (type === "link" && href) {
        return (
            <Link href={href}>
                <button className={className}>{children}</button>
            </Link>
        );
    }
    return (
        <button className={className} onClick={onClick}>
            {children}
        </button>
    );
}

function TextButton({ href, children, type = "link", onClick }: ButtonProps) {
    const className =
        "px-6 py-2 text-gray-700 hover:text-primary transition-colors font-medium";
    if (type === "link" && href) {
        return (
            <Link href={href}>
                <button className={className}>{children}</button>
            </Link>
        );
    }
    return (
        <button className={className} onClick={onClick}>
            {children}
        </button>
    );
}

export { SolidButton, TextButton };
export type { ButtonProps };