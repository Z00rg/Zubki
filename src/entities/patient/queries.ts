import {useMutation, useQuery} from "@tanstack/react-query";
import {CreatePatient, patientApi, UpdatePatient} from "@/shared/api/patientApi";
import {queryClient} from "@/shared/api/query-client";
import {queue} from "@/shared/ui/Toast";

const patientListKey = ["patient-list"];
const patientCasesListKey = ["patient-cases-list"];

// Запрос информации о списке пациентов
export function usePatientListQuery() {

    return useQuery({
        queryKey: patientListKey,
        queryFn: patientApi.getPatientList,
        retry: 0,
        staleTime: 5 * 60 * 1000, // 5 минут
    });
}

// Запрос информации о приемах пациента
export function usePatientCasesListQuery(idPatient: string) {

    return useQuery({
        queryKey: [...patientCasesListKey, idPatient],
        queryFn: () => patientApi.getPatientCasesList(idPatient),
        retry: 0,
    });
}

// Action после мутации
type OnSuccessAction = () => void;

// Добавление нового пациента
export function useCreatePatientMutation({ onSuccessActions }: { onSuccessActions?: OnSuccessAction[] }) {
    return useMutation({
        mutationFn: (data: CreatePatient) => patientApi.createPatient(data),
        onSuccess: () => {
            queryClient.invalidateQueries();
            onSuccessActions?.forEach(onSuccessAction => onSuccessAction());

            // Показываем успешный тост
            queue.add({
                title: 'Пациент добавлен',
                description: 'Пациент успешно добавлен в систему',
                type: 'success'
            }, {
                timeout: 3000
            });
        },
        onError: (error) => {
            console.error("Ошибка при добавлении пациента:", error);
            alert("Ошибка при добавлении пациента");
        },
    });
}

// Редактирование пациента
export function useUpdatePatientMutation({ onSuccessActions = [] }: { onSuccessActions?: OnSuccessAction[] }) {
    return useMutation({
        mutationFn: ({idPatient, data} : {idPatient: number, data: UpdatePatient}) => patientApi.updatePatient(idPatient, data),
        onSuccess: () => {
            queryClient.invalidateQueries();
            onSuccessActions.forEach(onSuccessAction => onSuccessAction());

            // Показываем успешный тост
            queue.add({
                title: 'Пациент обновлён',
                description: 'Данные пациента успешно обновлены',
                type: 'success'
            }, {
                timeout: 3000
            });
        },
        onError: (error) => {
            console.error("Ошибка при редактировании пациента:", error);
            alert("Ошибка при редактировании пациента");
        },
    });
}

