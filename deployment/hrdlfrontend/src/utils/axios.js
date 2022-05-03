import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import store from '../redux/store';
import authSlice from '../redux/auth/auth.reducer';

const API_PATH = `http://${window.location.hostname}:8000/api/`;

// Create the interceptor
const axiosService = axios.create({
    baseURL: `${API_PATH}`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor for auth token
axiosService.interceptors.request.use(async (config) => {
    const { token, refreshToken } = store.getState().auth;

    if (token !== null) {
        config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
});

// Interceptor for response
axiosService.interceptors.response.use(
    (res) => {
        return Promise.resolve(res);
    },
    (err) => {
        return Promise.reject(err);
    }
);

// interceptor for refresh token
// occurs upon failed request
const refreshAuthLogic = async (failedRequest) => {
    const { refreshToken } = store.getState().auth;
    return axios
        .post(
            'auth/refresh/',
            {
                refresh: refreshToken,
            },
            {
                baseURL: `${API_PATH}`
            }
        )
        .then((resp) => {
            const { access, refresh } = resp.data;
            failedRequest.response.config.headers.Authorization = 'Bearer ' + access;
            store.dispatch(
                authSlice.actions.setAuthTokens({ token: access, refreshToken: refresh })
            );
        })
        .catch((err) => {
            // if errored response, log user out
            if (err.response && (err.response.status === 400|| err.response.status === 401)) {
                store.dispatch(authSlice.actions.setLogout());
            }
        });
};

// refresh inte
createAuthRefreshInterceptor(axiosService, refreshAuthLogic);


// default services
export function fetcher(url) {
    return axiosService.get(url).then((res) => {
        return res.data
    });
}

export function putter(url, body) {
    return axiosService.put(url, JSON.stringify(body)).then((res) => res.data);
}

export function poster(url, body) {
    return axiosService.post(url, body).then((res) => res.data);
}

export function deleter(url, body) {
    return axiosService.delete(url, body).then((res) => res.data);
}

export default axiosService;