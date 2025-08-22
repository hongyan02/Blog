import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// 列表查询
export const useGunCodeQuery = () => {
    return useQuery({
        queryKey: ["guncode"],
        queryFn: async () => {
            const res = await fetch("/api/v1/df/guncode", {
                credentials: "include", // 关键：带上 HttpOnly Cookie
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json(); // { data: WeaponBuild[] }
        },
    });
};

// 上传
export const useGunCodeMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: {
            weaponName: string;
            gunCode: string;
            description: string;
            isPublic: boolean;
        }) => {
            const res = await fetch("/api/v1/df/guncode", {
                method: "POST",
                credentials: "include", // 关键：带上 Cookie
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json(); // { data: WeaponBuild }
        },
        onSuccess: () => {
            // 上传成功后自动刷新列表
            queryClient.invalidateQueries({ queryKey: ["guncode"] });
        },
    });
};

export const useDeleteGunCodeMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/v1/df/guncode`, {
                method: "DELETE",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["guncode"] });
        },
    });
};
