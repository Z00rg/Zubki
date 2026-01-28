import {usePatientListQuery} from "@/entities/patient";
import {useState} from "react";
import {Patient} from "@/shared/api/patientApi";

export function useGetPatientList() {

    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    const patientListQuery = usePatientListQuery();

    const patientList = patientListQuery.data ?? [];

    return {
        patientList,
        selectedPatient,
        setSelectedPatient,
        isLoading: patientListQuery.isPending,
        isError: patientListQuery.isError,
    }
}