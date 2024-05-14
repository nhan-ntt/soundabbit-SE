import { nextui } from "@nextui-org/theme";

module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./layouts/**/*.{js,ts,jsx,tsx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        container: {
            center: true,
        },
        screens: {
            mobile: {
                min: "100px",
                max: "550px",
            },
            tablet: {
                min: "550px",
                max: "750px",
            },
            "mini-laptop": {
                min: "750px",
                max: "874px",
            },
            laptop: {
                min: "874px",
                max: "1280px",
            },
            desktop: {
                min: "1280px",
            },
        },
        borderWidth: {
            DEFAULT: "0.5px",
        },
        extend: {},
        future: {
            hoverOnlyWhenSupported: true,
        },
    },
    darkMode: "class",
    plugins: [nextui()],
};
