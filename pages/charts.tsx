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

const Charts: NextPage = () => {
    const [selectedLeague, setselectedLeague] = React.useState<any>(23172);
    const [selectedStat, setselectedStat] = React.useState<string>("HR");

    const formattedData = jsonData.theData
        .filter((z) => z.leagueId == selectedLeague)
        .map((x: any) => {
            return {
                name: x.teamName,
                data: x.statsHistory[selectedStat],
                // data: x.statsHistory[selectedStat].map((y: number) => {
                //     return ["OBP", "OPS"].includes(selectedStat) ? y / 1000 : y;
                // }),
            };
        });

    const handleLeagueChange = (event: SelectChangeEvent) => {
        setselectedLeague(Number(event.target.value) as number);
    };

    const handleStatChange = (event: SelectChangeEvent) => {
        setselectedStat(event.target.value as string);
    };

    return (
        <Container sx={{ marginTop: 3 }}>
            <Container sx={{ display: "flex", justifyContent: "space-around" }}>
                <Box sx={{ minWidth: 300 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">League</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selectedLeague}
                            onChange={handleLeagueChange}
                        >
                            <MenuItem value={23172}>D1 - The Sultans of Stats</MenuItem>

                            <MenuItem value={23173}>D2 - Satchel Paige</MenuItem>
                            <MenuItem value={23174}>D2 - Minnie Miñoso</MenuItem>
                            <MenuItem value={23175}>D2 - Josh Gibson</MenuItem>

                            <MenuItem value={23176}>D3 - Tim Salmon</MenuItem>
                            <MenuItem value={23177}>D3 - Garret Anderson</MenuItem>
                            <MenuItem value={23178}>D3 - Darin Erstad</MenuItem>
                            <MenuItem value={23179}>D3 - Jim Edmonds</MenuItem>
                            <MenuItem value={23180}>D3 - Troy Percival</MenuItem>
                            <MenuItem value={23181}>D3 - Gary DiSarcina</MenuItem>

                            <MenuItem value={23182}>D4 - Don Mattingly</MenuItem>
                            <MenuItem value={23183}>D4 - Mike Mussina</MenuItem>
                            <MenuItem value={23184}>D4 - Alan Trammel</MenuItem>
                            <MenuItem value={23185}>D4 - Tim Raines</MenuItem>
                            <MenuItem value={23186}>D4 - Roger Maris</MenuItem>
                            <MenuItem value={23187}>D4 - Luis Tiant</MenuItem>
                            <MenuItem value={21599}>D4 - David Cone</MenuItem>
                            <MenuItem value={21600}>D4 - Dick Allen</MenuItem>
                            <MenuItem value={21601}>D4 - Larry Walker</MenuItem>
                            <MenuItem value={21602}>D4 - Edgar Martinez</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ minWidth: 300 }}>
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
            </Container>

            <LineChartComponent data={formattedData} selectedStat={selectedStat} />
        </Container>
    );
};

export default Charts;
