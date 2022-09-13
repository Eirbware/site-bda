import axios, {AxiosResponse} from 'axios';

function authenticateUser(ticket: string, token: string) {
    return new Promise((resolve, reject) => {
        // @ts-ignore
        axios.get(`${import.meta.env.VITE_BACKEND_ADDRESS}/authenticate?token=${token}&ticket=${ticket}`, { withCredentials: true })
            .then((response: AxiosResponse<any>) => {
                if (!response.data.success) {
                    reject(response.data.error.message);
                    return;
                }

                resolve({});
            })
            .catch(error => {
                reject(error);
            });
    });
}

function logoutUser() {
    return new Promise((resolve, reject) => {
        // @ts-ignore
        axios.get(`${import.meta.env.VITE_BACKEND_ADDRESS}/logout`, { withCredentials: true })
            .then((response: AxiosResponse<any>) => {
                if (!response.data.success) {
                    reject(response.data);
                    return;
                }

                resolve({});
            })
            .catch(error => {
                reject(error);
            });
    });
}

export {authenticateUser, logoutUser};