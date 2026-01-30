import {usePatientCasesListQuery} from "@/entities/patient/queries";
import {useState} from "react";
import {PatientCase} from "@/shared/api/patientApi";


export function useGetPatientCasesList(idPatient: string) {

    const patientCasesListQuery = usePatientCasesListQuery(idPatient);

    const patientCasesList = patientCasesListQuery.data ?? [];

    return {
        patientCasesList,
        isLoading: patientCasesListQuery.isPending,
        isError: patientCasesListQuery.isError,
    }
}