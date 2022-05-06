import * as React from "react";
import type { NextPage } from "next";
import Container from "@mui/material/Container";
import LineChartComponent from "../components/LineChart";
import jsonData from "../src/allTheData.json";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

// const formattedData = jsonData.theData
//     .filter((z) => z.leagueId == 23173)
//     .map((x: any) => {
//         let counter = 0;

//         return {
//             name: x.teamName,
//             data: x.statsHistory.HR,
//         };
//     });
// console.log("formattedData:", formattedData);

const Charts: NextPage = () => {
    const [selectedLeague, setselectedLeague] = React.useState(23173);
    const [selectedStat, setselectedStat] = React.useState("HR");

    const formattedData = jsonData.theData
        .filter((z) => z.leagueId == selectedLeague)
        .map((x: any) => {
            return {
                name: x.teamName,
                data: x.statsHistory[selectedStat],
            };
        });

    const handleLeagueChange = (event: SelectChangeEvent) => {
        setselectedLeague(event.target.value as string);
    };

    const handleStatChange = (event: SelectChangeEvent) => {
        setselectedStat(event.target.value as string);
    };

    return (
        <Container>
            <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">League</InputLabel>
                    <Select labelId="demo-simple-select-label" id="demo-simple-select" value={selectedLeague} onChange={handleLeagueChange}>
                        <MenuItem value={23173}>23173</MenuItem>
                        <MenuItem value={23174}>23174</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Stat</InputLabel>
                    <Select labelId="demo-simple-select-label" id="demo-simple-select" value={selectedStat} onChange={handleStatChange}>
                        <MenuItem value={"HR"}>Home Runs</MenuItem>
                        <MenuItem value={"R"}>Runs</MenuItem>
                        <MenuItem value={"RBI"}>RBI</MenuItem>
                        <MenuItem value={"SB"}>Steals</MenuItem>
                        <MenuItem value={"OBP"}>OBP</MenuItem>
                        <MenuItem value={"OPS"}>OPS</MenuItem>
                        <MenuItem value={"SO"}>Strikeouts</MenuItem>
                        <MenuItem value={"SV"}>Saves</MenuItem>
                        <MenuItem value={"HD"}>Holds</MenuItem>
                        <MenuItem value={"ERA"}>ERA</MenuItem>
                        <MenuItem value={"WHP"}>WHIP</MenuItem>
                        <MenuItem value={"QS"}>Quality Starts</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <LineChartComponent data={formattedData} />
        </Container>
    );
};

export default Charts;
