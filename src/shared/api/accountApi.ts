import {createInstance, RequestOptions} from "./api-instance";

// DTO

export interface GetProfileInfoDto {
    name: string;
    surname: string;
    patronymic: string;
}

// API

// Профиль
export const getProfileInfo = (options?: RequestOptions) =>
    createInstance<GetProfileInfoDto>(
        {url: `/account/profile/`, method: "GET"},
        options
    );

export const accountApi = {
    getProfileInfo,
};
