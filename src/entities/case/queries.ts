import {useMutation} from "@tanstack/react-query";
import {queryClient} from "@/shared/api/query-client";
import {caseApi, CreateCase} from "@/shared/api/caseApi";

// Action после мутации
type OnSuccessAction = () => void;

// Добавление нового приема
export function useCreateCaseMutation({ onSuccessActions }: { onSuccessActions?: OnSuccessAction[] }) {
    return useMutation({
        mutationFn: (data: CreateCase) => caseApi.createCase(data),
        onSuccess: () => {
            queryClient.invalidateQueries();
            onSuccessActions?.forEach(onSuccessAction => onSuccessAction());
        },
        onError: (error) => {
            console.error("Ошибка при добавлении приема:", error);
            alert("Ошибка при добавлении приема");
        },
    });
}
