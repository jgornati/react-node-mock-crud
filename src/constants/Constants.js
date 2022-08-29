/**
 * Created by joelg on 6/9/17.
 */

//localhost
if (process.env.NODE_ENV === 'development' && !process.env.REACT_APP_ENVI) {
    var BASE_URL = "http://localhost:54321";
    var API_HOST = "http://localhost:54321";
    var SOCKET_URL = "127.0.0.1";
}

if (process.env.NODE_ENV === 'production') {
    var BASE_URL = "https://opensafe.exadec.com/api";
    var API_HOST = "https://opensafe.exadec.com";
    var SOCKET_URL = "opensafe.exadec.com";
}

export default {
    BASE_URL: BASE_URL,
    API_HOST: API_HOST,
    SOCKET_URL: SOCKET_URL
}
