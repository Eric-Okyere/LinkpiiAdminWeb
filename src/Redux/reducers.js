const initialState = {
    login: false,
    signup: false,
    user: '',
    error: {},
    userData: { name: "", email: '', lastname: "" }
};

export default (state = initialState, action) => {
    switch (action.type) {
        case "LOGGED_IN":
            return { ...state, login: true, user: action.payload };
        case "SIGN_IN":
            return { ...state, signup: true, user: action.payload };
        case "LOGGED_OUT":
            return { ...state, login: false, user: '' };
        case "REGISTER_ERROR":
            return { ...state, error: { register: action.payload } };
        case "LOGIN_ERROR":
            return { ...state, error: { login: action.payload } };
        case "SET_USERDATA":
            return { ...state, userData: action.payload };
        default:
            return state;
    }
};
