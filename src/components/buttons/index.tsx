import Link from "next/link";
import React from "react";

type ButtonProps = {
    href?: string;
    children: React.ReactNode;
    type?: "link" | "button";
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
};

function SolidButton({ href, children, type = "link", onClick, className, disabled }: ButtonProps) {
    const classNameLocal =
        `px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors font-medium ${className || ""}`;
    if (type === "link" && href) {
        return (
            <Link href={href}>
                <button className={classNameLocal}>{children}</button>
            </Link>
        );
    }
    return (
        <button disabled={disabled} className={classNameLocal} onClick={onClick}>
            {children}
        </button>
    );
}

function TextButton({ href, children, type = "link", onClick, className, disabled }: ButtonProps) {
    const classNameLocal =
        `px-6 py-2 text-gray-700 hover:text-primary transition-colors font-medium ${className || ""}`;
    if (type === "link" && href) {
        return (
            <Link href={href}>
                <button className={classNameLocal}>{children}</button>
            </Link>
        );
    }
    return (
        <button disabled={disabled} className={classNameLocal} onClick={onClick}>
            {children}
        </button>
    );
}

export { SolidButton, TextButton };
export type { ButtonProps };