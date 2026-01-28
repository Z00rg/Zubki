import {createInstance, RequestOptions} from "./api-instance";

// DTO

export type CreateCase = {
    diagnosis: string;
}

// API

export const createCase = (data: CreateCase, options?: RequestOptions) =>
    createInstance<void>(
        {url: `/cases/create/`, method: "POST", data: data},
        options,
    );

export const caseApi = {
    createCase,
};
