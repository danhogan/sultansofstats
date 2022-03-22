import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

declare module '@mui/material/styles' {
    interface BreakpointOverrides {
        bigboi: true;
    }
}

// Create a theme instance.
const theme = createTheme({
    palette: {
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
            bigboi: 1800,
        },
    },
});

export default theme;
