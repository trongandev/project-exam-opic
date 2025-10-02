export const isLoggedIn = () => {
    // Logic thực tế để kiểm tra token, cookie...
    return localStorage.getItem('token') !== null
}

export const login = () => {
    localStorage.setItem('token', 'fake-jwt-token')
}

export const logout = () => {
    localStorage.removeItem('token')
}
