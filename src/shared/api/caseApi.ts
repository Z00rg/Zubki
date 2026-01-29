import {createInstance, RequestOptions} from "./api-instance";

// DTO

export type CreateCase = {
    patient: string;
    diagnosis: string;
}

export type UploadDicomDto = {
    case_id: number;
    file: File;
}

// API

export const createCase = (data: CreateCase, options?: RequestOptions) =>
    createInstance<void>(
        {url: `/cases/create/`, method: "POST", data: data},
        options,
    );

export const uploadDicom = (data: UploadDicomDto, options?: RequestOptions) => {
    const formData = new FormData();
    formData.append('file', data.file);

    return createInstance<void>(
        {
            url: `/cases/${data.case_id}/upload-dicom/`,
            method: "POST",
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        },
        options,
    );
};

export const caseApi = {
    createCase,
    uploadDicom,
};
