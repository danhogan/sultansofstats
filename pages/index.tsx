import * as React from "react";
import type { NextPage } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "../src/Link";

const Home: NextPage = () => {
    return (
        <Container maxWidth="lg">
            <Box
                sx={{
                    my: 4,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Typography
                    variant="h1"
                    className="sos-gradient"
                    sx={{
                        fontSize: {
                            xs: "7rem",
                            sm: "10rem",
                        },
                        fontWeight: "bold",
                    }}
                >
                    Sultans of Stats
                </Typography>

                <p>
                    Sultans of Stats is a 4-division fantasy baseball superleague with yearly relegation based on individual league and
                    overall division standings hosted on{" "}
                    <a href="https://fleaflicker.com/" target="_blank">
                        Fleaflicker
                    </a>
                    . The best places to start learning more are the{" "}
                    <a href="https://www.reddit.com/r/SultansOfStats/" target="_blank">
                        subreddit
                    </a>{" "}
                    and/or the{" "}
                    <a href="https://discord.gg/hkCQabyaDn" target="_blank">
                        Discord
                    </a>
                    .
                </p>
                <p>
                    This website is intended to serve as a central hub of information as well as a historical archive of all things SoS. If
                    you're handy with the beep boops, please feel free to contribute to the site via{" "}
                    <a href="https://github.com/danhogan/sultansofstats" target="_blank">
                        Github
                    </a>
                    .
                </p>
            </Box>
        </Container>
    );
};

export default Home;
