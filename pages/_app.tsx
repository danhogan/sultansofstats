import * as React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import theme from "../src/theme";
import "../src/styles.css";
import createEmotionCache from "../src/createEmotionCache";
import Layout from "../components/layout";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
    emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
    const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta property="og:title" content="Sultans of Stats" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.sultansofstats.com/" />
                <meta property="og:image" content="https://www.sultansofstats.com/images/sos.jpg" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Sultans of Stats" />
                <meta
                    name="twitter:description"
                    content="Sultans of Stats is a 4-division fantasy baseball superleague with yearly relegation based on individual league and overall division standings."
                />
                <meta name="twitter:image" content="https://www.sultansofstats.com/images/sos.jpg" />
                <link rel="shortcut icon" href="/favicon.ico" />
            </Head>
            <ThemeProvider theme={theme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </ThemeProvider>
        </CacheProvider>
    );
}
