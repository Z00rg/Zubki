import {usePatientCasesListQuery} from "@/entities/patient/queries";


export function useGetPatientCasesList(idPatient: number) {

    const patientCasesListQuery = usePatientCasesListQuery(idPatient);

    const patientCasesList = patientCasesListQuery.data ?? [];

    return {
        patientCasesList,
        isLoading: patientCasesListQuery.isPending,
        isError: patientCasesListQuery.isError,
    }
}