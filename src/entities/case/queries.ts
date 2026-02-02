import {useMutation} from "@tanstack/react-query";
import {queryClient} from "@/shared/api/query-client";
import {caseApi, CreateCase, UploadDicomDto} from "@/shared/api/caseApi";
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

            queue.add({
                title: 'Ошибка: прием не добавлен',
                description: `Ошибка при добавлении приема: ${error}`,
                type: 'error'
            }, {
                timeout: 3000
            });
        },
    });
}

// Добавление КТ к приему
export function useUploadDicomMutation({ onSuccessActions }: { onSuccessActions?: OnSuccessAction[] } = {}) {
    return useMutation({
        mutationFn: (data: UploadDicomDto) => caseApi.uploadDicom(data),
        onSuccess: () => {
            queryClient.invalidateQueries();
            onSuccessActions?.forEach(action => action());

            queue.add({
                title: 'DICOM загружен',
                description: `Файл успешно загружен, подождите, пока будут проведены расчеты, обновите страничку чуть позже`,
                type: 'success'
            }, {
                timeout: 8000
            });
        },
        onError: (error) => {
            console.error("Ошибка при загрузке DICOM:", error);

            queue.add({
                title: 'Ошибка загрузки',
                description: 'Не удалось загрузить DICOM файл',
                type: 'error'
            }, {
                timeout: 5000
            });
        },
    });
}