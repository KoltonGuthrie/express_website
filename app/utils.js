function isLoggedIn(r) {
    return r?.session?.username != null;
}

export { isLoggedIn }