/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            fontFamily: {
                "dm-sans": ["DM-Sans-Regular", "sans-serif"],
                "dm-sans-bold": ["DM-Sans-Bold", "sans-serif"],
                "dm-sans-medium": ["DM-Sans-Medium", "sans-serif"],
                "dm-sans-regular": ["DM-Sans-Regular", "sans-serif"],
                "dm-sans-semi-bold": ["DM-Sans-SemiBold", "sans-serif"],
                "dm-sans-thin": ["DM-Sans-Thin", "sans-serif"],
                "dm-sans-light": ["DM-Sans-Light", "sans-serif"],
            },
        },
    },
    plugins: [],
};
