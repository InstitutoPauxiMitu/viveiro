        // frontend/tailwind.config.js
        /** @type {import('tailwindcss').Config} */
        export default {
          content: [
            "./index.html",
            "./src/**/*.{js,ts,jsx,tsx}", // Garante que o Tailwind escaneie todos os arquivos JS, TS, JSX, TSX na pasta src
          ],
          theme: {
            extend: {
              fontFamily: {
                sans: ['Inter', 'sans-serif'], // Define 'Inter' como a fonte padrão sans-serif
              },
              animation: {
                'fade-in-down': 'fadeInDown 0.5s ease-out',
                'fade-in-up': 'fadeInUp 0.5s ease-out',
              },
              keyframes: {
                fadeInDown: {
                  '0%': { opacity: '0', transform: 'translateY(-20px)' },
                  '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeInUp: {
                  '0%': { opacity: '0', transform: 'translateY(20px)' },
                  '100%': { opacity: '1', transform: 'translateY(0)' },
                },
              },
            },
          },
          plugins: [],
        }