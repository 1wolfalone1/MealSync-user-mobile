/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#DF4830',
        bg: {
          DEFAULT: '#FFFFFF',
          100: '#F6F7F8',
          200: '#F2F3F5',
        },
        glass: {
          DEFAULT: "#ffffffab",
          100: "#3b0000cc"
        },
        shadow: {
          DEFAULT: '#df473093',
          100: '#df473071',
          200: '#df473044',
          300: '#df473025',
        },
        tertiary: '#9EA1B1',
        text: {
          DEFAULT: '#323643',
          100: '#232533',
          200: '#1E1E2D',
          900: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#FF9C01',
          100: '#FF9001',
          200: '#FF8E01',
        },
        black: {
          DEFAULT: '#000',
          100: '#1E1E2D',
          200: '#232533',
        },
        gray: {
          100: '#CDCDE0',
        },
      },
      fontFamily: {
        pthin: ['Poppins-Thin', 'sans-serif'],
        pextralight: ['Poppins-ExtraLight', 'sans-serif'],
        plight: ['Poppins-Light', 'sans-serif'],
        pregular: ['Poppins-Regular', 'sans-serif'],
        pmedium: ['Poppins-Medium', 'sans-serif'],
        psemibold: ['Poppins-SemiBold', 'sans-serif'],
        pbold: ['Poppins-Bold', 'sans-serif'],
        pextrabold: ['Poppins-ExtraBold', 'sans-serif'],
        pblack: ['Poppins-Black', 'sans-serif'],
        hnow21thin: ['HeadingNow-21Thin', 'sans-serif'],
        hnow22light: ['HeadingNow-22Light', 'sans-serif'],
        hnow23book: ['HeadingNow-23Book', 'sans-serif'],
        hnow55medium: ['HeadingNow-55Medium', 'sans-serif'],
        hnow61thin: ['HeadingNow-61Thin', 'sans-serif'],
        hnow62light: ['HeadingNow-62Light', 'sans-serif'],
        hnow63book: ['HeadingNow-63Book', 'sans-serif'],
        hnow64regular: ['HeadingNow-64Regular', 'sans-serif'],
        hnow65medium: ['HeadingNow-65Medium', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
