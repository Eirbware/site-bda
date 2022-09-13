import axios from "axios";

export function uploadProfilePicture(file: File) {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve("");
            return;
        }

        const formData = new FormData();
        formData.append('profilePicture', file);

        // @ts-ignore
        axios.post(`${import.meta.env.VITE_BACKEND_ADDRESS}/upload/profile-picture`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        }).then((response) => {
            resolve(response.data.fileName);
        }).catch((error) => {
            reject(error);
        });
    });
}