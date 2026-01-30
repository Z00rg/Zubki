import {usePatientCasesListQuery} from "@/entities/patient/queries";


export function useGetPatientCasesList(idPatient: string) {

    const patientCasesListQuery = usePatientCasesListQuery(idPatient);

    const patientCasesList = patientCasesListQuery.data ?? [];

    return {
        patientCasesList,
        isLoading: patientCasesListQuery.isPending,
        isError: patientCasesListQuery.isError,
    }
}