import axiosInstance from "../utils/comreqtool";


export async function getAvatar() {
    axiosInstance.defaults.headers['Content-Type'] = 'application/json';
    return await axiosInstance.post("https://api.uomg.com/api/rand.avatar?sort=男&format=json");
}