import {createInstance, RequestOptions} from "./api-instance";

// DTO

export type Patient = {
    id: number;
    name: string;
    surname: string;
    patronymic: string;
    birth_date: string;
    gender: 0 | 1;
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
    createInstance<Patient>(
        {url: `/patients/`, method: "GET"},
        options
    );

export const createPatient = (body: CreatePatient, options?: RequestOptions) =>
    createInstance<void>(
        {url: `/patients/create/`, method: "GET"},
        options
    );

export const updatePatient = (idPatient: number, body: UpdatePatient, options?: RequestOptions) =>
    createInstance<void>(
        {url: `/patients/update/${idPatient}`, method: "GET"},
        options
    );

export const patientApi = {
    getPatientList,
    createPatient,
    updatePatient,
};
