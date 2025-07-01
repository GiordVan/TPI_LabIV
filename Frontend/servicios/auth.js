function getToken() {
    return sessionStorage.getItem("token");
}

function getUsuario() {
    const userJson = sessionStorage.getItem("usuario");
    return userJson ? JSON.parse(userJson) : null;
}

function verificarAutenticacion() {
    const token = getToken();
    const usuario = getUsuario();

    if (!token || !usuario) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("usuario");
        return null;
    }

    return usuario;
}

export { getToken, getUsuario, verificarAutenticacion };