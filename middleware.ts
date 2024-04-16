export { default } from "next-auth/middleware"

export const config = {
    matcher: [
        "/artist/:path*",
        "/genre/:path*",
        "/playlist/:path*",
        "/account",
        "/home",
        "/index",
        "/library",
        "/playing",
        "/providers",
        "/queue",
        "/search",
    ]
}




