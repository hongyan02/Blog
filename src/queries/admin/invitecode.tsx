import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useInviteCode = () => {
    return useQuery({
        queryKey: ["inviteCode"],
        queryFn: async () => {
            const res = await fetch("/api/v1/invites", {
                credentials: "include", // 关键：带上 HttpOnly Cookie
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json(); // { data: WeaponBuild[] }
        },
    });
};

export const useCreateInviteCode = () => {
    return useMutation({
        mutationFn: async () => {
            const res = await fetch("/api/v1/invites", {
                method: "POST",
                credentials: "include", // 关键：带上 HttpOnly Cookie
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json(); // { data: WeaponBuild[] }
        },
    });
};
