import { ComponentType } from "react";

export interface AnyBarProps {
    barComponent: ComponentType<{ datasource: any[] }>;
    items: any[]; // 数据由外部注入
}

export default function AnyBar({ barComponent: Bar, items }: AnyBarProps) {
    return <Bar datasource={items} />;
}
