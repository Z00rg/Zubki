import {createInstance, RequestOptions} from "./api-instance";

// DTO

export type Patient = {
    id: number;
    fio: string;
    birth_date: string;
    gender: 0 | 1;
}

export type PatientCase = {
    id: number;
    patient: number;
    patient_fio: string;
    user: number;
    diagnosis: string;
    created_at: string;
}

export type CreatePatient = {
    name: string;
    surname: string;
    patronymic: string;
    birth_date: string;
    gender: 0 | 1;
}

export type UpdatePatient = Partial<CreatePatient>

// API

export const getPatientList = (options?: RequestOptions) =>
    createInstance<Patient[]>(
        {url: `/patients/`, method: "GET"},
        options
    );

export const getPatientCasesList = (idPatient: number, options?: RequestOptions) =>
    createInstance<PatientCase[]>(
        {url: `/patients/${idPatient}/cases/`, method: "GET"},
        options
    );

export const createPatient = (data: CreatePatient, options?: RequestOptions) =>
    createInstance<void>(
        {url: `/patients/create/`, method: "POST", data: data},
        options,
    );

export const updatePatient = (idPatient: number, data: UpdatePatient, options?: RequestOptions) =>
    createInstance<void>(
        {url: `/patients/update/${idPatient}`, method: "PATCH", data: data},
        options
    );

export const patientApi = {
    getPatientList,
    getPatientCasesList,
    createPatient,
    updatePatient,
};
