import {createInstance, RequestOptions} from "./api-instance";

// DTO

export type Patient = {
    id: string;
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
    implant_data: Implant_data;
    dicom_files: string[];
}

export type Implant_data = {
    id: number;
    visualization_image: string;
    density_graph: string;
    diameter: number;
    length: number;
    thread_shape: string;
    thread_pitch: number;
    thread_depth: string;
    bone_type: string;
    hu_density: number;
    chewing_load: number;
    limit_stress: number;
    surface_area: number;
    is_calculated: boolean;
    created_at: string;
    case: number;
    implant_variant: number;
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

export const getPatientCase = (idPatient: string | undefined, idCase: number | undefined, options?: RequestOptions) =>
    createInstance<PatientCase>(
        {url: `/patients/${idPatient}/cases/${idCase}`, method: "GET"},
        options
    );

export const getPatientCasesList = (idPatient: string, options?: RequestOptions) =>
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
    getPatientCase,
    createPatient,
    updatePatient,
};
