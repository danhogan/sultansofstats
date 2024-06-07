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
    const [selectedLeague, setselectedLeague] = React.useState<any>("fmsw2r2blci8ghpy");
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
        setselectedLeague(event.target.value as string);
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
                            {/* TODO: Pull this stuff dynamically */}
                            <MenuItem value={"e3px47n0lr7xx2y9"}>D1 - The Sultans of Stats</MenuItem>

                            <MenuItem value={'88ggwnu4lr7xxkg8'}>D2 - Flea Clifton</MenuItem>
                            <MenuItem value={'7vlt8wtklr7xxtne'}>D2 - Alex Flicker</MenuItem>
                            <MenuItem value={'77en7xmelr7xy3n1'}>D2 - Mortiz Seider</MenuItem>

                            <MenuItem value={'y6zp4bfslr7xyfbe'}>D3 - Ron Santo</MenuItem>
                            <MenuItem value={'kpc4liy3lr7xyner'}>D3 - Sammy Sosa</MenuItem>
                            <MenuItem value={'wm8ixb3flr7y4vh5'}>D3 - Greg Maddux</MenuItem>
                            <MenuItem value={'838h7q3plr7xz1nt'}>D3 - Moises Alou</MenuItem>
                            <MenuItem value={'24f5ki4tlr7xza1j'}>D3 - Kyle Hendricks</MenuItem>
                            <MenuItem value={'ou1xzkfplr7xzie8'}>D3 - Bryzzo Souvenir</MenuItem>
                            <MenuItem value={'ls0uwwrqlr7xyuss'}>D3 - Steve Bartman</MenuItem>

                            <MenuItem value={'3y3ol2vzlr7xzq5s'}>D4 - Pete Alonso</MenuItem>
                            <MenuItem value={'yr8kla9jlr7y38vm'}>D4 - Jonathan India</MenuItem>
                            <MenuItem value={'mb8xviqylr7y2zvv'}>D4 - A.J</MenuItem>
                            <MenuItem value={'d9idp3pzlr7y2p5d'}>D4 - Brady Singer</MenuItem>
                            <MenuItem value={'qnyleexplr7y2dze'}>D4 - Harrison Bader</MenuItem>
                            <MenuItem value={'di1qgcmtlr7y2489'}>D4 - Wyatt Langford</MenuItem>
                            <MenuItem value={'scq69b6xlr7y1suk'}>D4 - Hurston Waldrep</MenuItem>
                            <MenuItem value={'f168202alr7y1egz'}>D4 - Mike Zunino</MenuItem>
                            <MenuItem value={'b3xezupjlr7y17rx'}>D4 - Anthony DeSclafani</MenuItem>
                            <MenuItem value={'kydzgf8clr7y0zue'}>D4 - Dane Dunning</MenuItem>
                            <MenuItem value={'2xpo8hpflr7y0om1'}>D4 - Kirby Snead</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ minWidth: 300 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Stat</InputLabel>
                        <Select labelId="demo-simple-select-label" id="demo-simple-select" value={selectedStat} onChange={handleStatChange}>
                            <MenuItem value={"R"}>Runs</MenuItem>
                            <MenuItem value={"HR"}>Home Runs</MenuItem>
                            <MenuItem value={"RBI"}>RBI</MenuItem>
                            <MenuItem value={"SB"}>Steals</MenuItem>
                            <MenuItem value={"OBP"}>OBP</MenuItem>
                            <MenuItem value={"OPS"}>OPS</MenuItem>
                            <MenuItem value={"QS"}>W+QS</MenuItem>
                            <MenuItem value={"SO"}>Strikeouts</MenuItem>
                            <MenuItem value={"K9"}>K/9</MenuItem>
                            <MenuItem value={"SV"}>SV+HLD</MenuItem>
                            <MenuItem value={"ERA"}>ERA</MenuItem>
                            <MenuItem value={"WHP"}>WHIP</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Container>

            <LineChartComponent data={formattedData} selectedStat={selectedStat} />
        </Container>
    );
};

export default Charts;
