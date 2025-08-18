import axios from "axios";

const Api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    headers: { "Content-Type": "application/json" },
});

const getToken = (key) => localStorage.getItem(key);
const setToken = (key, value) => localStorage.setItem(key, value);

// ✅ Request interceptor
Api.interceptors.request.use((config) => {
    const publicRoutes = ["/register/", "/auth/login/", "/auth/refresh/"];
    if (!publicRoutes.some((r) => config.url.endsWith(r))) {
        const access = getToken("access");
        if (access) config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
});

// ✅ Response interceptor
Api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const original = err.config;

        if (err.response?.status === 401 && !original._retry) {
            original._retry = true;
            try {
                const refresh = getToken("refresh");
                if (!refresh) throw new Error("No refresh token");

                const { data } = await Api.post("/auth/refresh/", { refresh });
                setToken("access", data.access);

                original.headers.Authorization = `Bearer ${data.access}`;
                return Api(original);
            } catch {
                localStorage.clear();
                window.location.href = "/login";
            }
        }
        return Promise.reject(err);
    }
);

export default Api;
