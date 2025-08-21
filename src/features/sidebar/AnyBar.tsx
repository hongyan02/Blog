import { ComponentType } from "react";

export interface AnyBarProps<T = unknown> {
    barComponent: ComponentType<{ datasource: T[] }>;
    items: T[]; // 数据由外部注入
}

export default function AnyBar<T = unknown>({ barComponent: Bar, items }: AnyBarProps<T>) {
    return <Bar datasource={items} />;
}
