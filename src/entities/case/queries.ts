import {useMutation} from "@tanstack/react-query";
import {queryClient} from "@/shared/api/query-client";
import {caseApi, CreateCase} from "@/shared/api/caseApi";
import {queue} from "@/shared/ui/Toast";

// Action после мутации
type OnSuccessAction = () => void;

// Добавление нового приема
export function useCreateCaseMutation({ onSuccessActions }: { onSuccessActions?: OnSuccessAction[] }) {
    return useMutation({
        mutationFn: (data: CreateCase) => caseApi.createCase(data),
        onSuccess: () => {
            queryClient.invalidateQueries();
            onSuccessActions?.forEach(onSuccessAction => onSuccessAction());

            // Показываем успешный тост
            queue.add({
                title: 'Прием добавлен',
                description: 'Прием успешно добавлен в систему',
                type: 'success'
            }, {
                timeout: 3000
            });
        },
        onError: (error) => {
            console.error("Ошибка при добавлении приема:", error);
            alert("Ошибка при добавлении приема");
        },
    });
}
