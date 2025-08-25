import { useQuery } from "@tanstack/react-query";

export const usePublicGunCodeQuery = () => {
    return useQuery({
        queryKey: ["public-guncode"],
        queryFn: async () => {
            const res = await fetch("/api/v1/df/guncode/public", {
                // credentials: "include", // 关键：带上 HttpOnly Cookie
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json(); // { data: WeaponBuild[] }
        },
    });
};
