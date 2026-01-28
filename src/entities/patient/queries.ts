import {useMutation, useQuery} from "@tanstack/react-query";
import {CreatePatient, patientApi, UpdatePatient} from "@/shared/api/patientApi";
import {queryClient} from "@/shared/api/query-client";

const patientListKey = ["patient-list"];

// Запрос информации о списке пациентов
export function usePatientListQuery() {

    return useQuery({
        queryKey: patientListKey,
        queryFn: patientApi.getPatientList,
        retry: 0,
        staleTime: 5 * 60 * 1000, // 5 минут
    });
}

// Добавление нового пациента
export function useCreatePatientMutation() {
    return useMutation({
        mutationFn: (data: CreatePatient) => patientApi.createPatient(data),
        onSuccess: () => {
            queryClient.invalidateQueries();
        },
        onError: (error) => {
            console.error("Ошибка при добавлении пациента:", error);
            alert("Ошибка при добавлении пациента");
        },
    });
}

// Редактирование пациента
export function useUpdatePatientMutation() {
    return useMutation({
        mutationFn: ({idPatient, data} : {idPatient: number, data: UpdatePatient}) => patientApi.updatePatient(idPatient, data),
        onSuccess: () => {
            queryClient.invalidateQueries();
        },
        onError: (error) => {
            console.error("Ошибка при редактировании пациента:", error);
            alert("Ошибка при редактировании пациента");
        },
    });
}

