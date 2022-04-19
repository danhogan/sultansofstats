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
import Toggle from "../components/toggle";
import Layout from "../components/layout";
import jsonData from "../src/allTheData.json";

const Leaderboard: NextPage = () => {
    const [allData, setAllData] = React.useState<object>(jsonData.theData);
    const [statValueLocation, setStatValueLocation] = React.useState<string>("statValues");

    const formattedDate = function () {
        const theDate = new Date(jsonData.updateDate);
        return `${theDate.toLocaleDateString()} @ ${theDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    };

    const getDivisionFilter = (divisionFilter: number) => {
        //0 is all
        if (divisionFilter === 0) {
            setAllData(jsonData.theData);
            setStatValueLocation("statValues");
            // this.$set(this.headers, 3, {text: "Overall Ranking", value: "overallRank"});
            // this.$set(this.headers, 4, {text: "Total Points", value: "totalPoints"});
        } else {
            setAllData(jsonData.theData.filter((x) => x.division === divisionFilter));
            setStatValueLocation("divisionValues");
            // this.$set(this.headers, 3, {text: "Division Ranking", value: "divisionRank"});
            // this.$set(this.headers, 4, {text: "Division Points", value: "divisionPoints"});
        }
    };

    return (
        <Container maxWidth="bigboi" className="board-container">
            <Container style={{ marginBottom: "1em", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                <Toggle emitDivisionFilter={getDivisionFilter}></Toggle>
                <span style={{}}>Last Updated: {formattedDate()}</span>
            </Container>
            <LeaderboardComponent data={allData} statValueLocation={statValueLocation}></LeaderboardComponent>
        </Container>
    );
};

export default Leaderboard;
