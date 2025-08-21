import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function validateUsername(u: string) {
    // 中文、英文字母、数字，2–20 位
    return /^[\u4e00-\u9fa5a-zA-Z0-9]{2,20}$/.test(u);
}

export function validatePassword(p: string) {
    // 只允许 0-9 a-z A-Z @
    // 且必须同时包含 1 位数字 + 1 位字母
    return /^(?=.*\d)(?=.*[a-zA-Z])[\dA-Za-z@]{6,}$/.test(p);
}
