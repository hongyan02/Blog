"use client";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/ui/table";
import { useInviteCode } from "@/queries/admin/invitecode";
import { Invite } from "@/db/schema";

export default function InviteTable() {
    const { data, isLoading, error } = useInviteCode();
    if (isLoading) {
        return <div>加载中...</div>;
    }

    if (error) {
        return <div>加载失败: {error.message}</div>;
    }

    if (!data) {
        return <div>暂无数据</div>;
    }
    return (
        <Table>
            <TableCaption>创建的邀请码.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">邀请码</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>创建人</TableHead>
                    <TableHead>使用人</TableHead>
                    <TableHead>过期时间</TableHead>
                    <TableHead>创建时间</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((item: Invite) => (
                    <TableRow key={item.code}>
                        <TableCell>{item.code}</TableCell>
                        <TableCell>{item.used ? "已使用" : "未使用"}</TableCell>
                        <TableCell>{item.creator}</TableCell>
                        <TableCell>{item.usedBy}</TableCell>
                        <TableCell>{item.expiresAt?.toLocaleString()}</TableCell>
                        <TableCell>{item.createdAt?.toLocaleString()}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
