import axios, { AxiosRequestConfig, AxiosError } from "axios";

export const sendRequest = async <T>(props: IRequest): Promise<T> => {
    let {
        url,
        method,
        body,
        // queryParams = {},
        useCredentials = false,
        headers = {},
        nextOption = {}
    } = props;

    const options: AxiosRequestConfig = {
        url,
        method,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        data: body ? body : undefined,
        withCredentials: useCredentials,
        ...nextOption,
    };

    try {
        const response = await axios.request<T>(options);
        return response.data;
    } catch (error) {
        const err = error as AxiosError<any>;
        return {
            statusCode: err.response?.status ?? 500,
            message: err.response?.data?.message ?? err.message,
            error: err.response?.data?.error ?? "Unknown error",
        } as T;
    }
};
