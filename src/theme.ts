import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import type { } from '@mui/x-data-grid/themeAugmentation';
// import type { } from '@mui/x-data-grid-pro/themeAugmentation';

declare module '@mui/material/styles' {
    interface BreakpointOverrides {
        bigboi: true;
    }
}

// Create a theme instance.
const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#ED4B25',
        },
        secondary: {
            main: '#336597',
        },
        error: {
            main: red.A400,
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
            bigboi: 1920,
        },
    },
    components: {
        MuiDataGrid: {
            // styleOverrides: {
            //     root: {
            //         backgroundColor: 'red',
            //     },
            // },
        },
    }
});

export default theme;
