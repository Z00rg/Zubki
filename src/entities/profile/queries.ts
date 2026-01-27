import {accountApi} from "@/shared/api/accountApi";
import {useQuery} from "@tanstack/react-query";

const profileKey = ["profile"];

// Запрос информации о профиле
export function useProfileQuery() {
    
    return useQuery({
        queryKey: profileKey,
        queryFn: accountApi.getProfileInfo,
        retry: 0,
        staleTime: 60 * 60 * 1000, // 60 минут
    });
}

