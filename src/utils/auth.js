import jwt_decode from 'jwt-decode';

var authUtil = {
    getUser() {
        return localStorage.token ? jwt_decode(localStorage.token) : "";
    },
    isLoggedIn() {
        return !!localStorage.token;
    },
    addToken(response) {
        if (response.headers)
            for (var pair of response.headers.entries()) {
                if (pair[0] === "authorization" && pair[1].split(" ")[1]) {
                    localStorage.token = pair[1].split(" ")[1];
                }
            }
        else if (response.getResponseHeader && response.getResponseHeader("authorization") && response.getResponseHeader("authorization").split(" ")[1])
            localStorage.token = response.getResponseHeader("authorization").split(" ")[1];

    },
}

export default authUtil;