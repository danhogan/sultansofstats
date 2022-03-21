import * as React from "react";
import type { NextPage } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "../src/Link";
import ProTip from "../src/ProTip";
import Copyright from "../src/Copyright";
import LeaderboardComponent from "../components/leaderboard";
import Layout from "../components/layout";

const Leaderboard: NextPage = () => {
    return (
        <Container maxWidth="bigboi">
            <LeaderboardComponent></LeaderboardComponent>
        </Container>
    );
};

export default Leaderboard;
