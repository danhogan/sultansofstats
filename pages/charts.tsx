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
            const dataWithReplacedCommas = x.statsHistory[selectedStat].map((item: string) => {
                return Number(item.replace(/\,/g, ''));
            });
    
            return {
                name: x.teamName,
                data: dataWithReplacedCommas,
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
                            <MenuItem value={"fmsw2r2blci8ghpy"}>D1 - The Sultans of Stats</MenuItem>

                            <MenuItem value={'5u9acbwjlci8gl0h'}>D2 - Jay Johnstone</MenuItem>
                            <MenuItem value={'e157klkilci8gcwq'}>D2 - Reggie Jackson</MenuItem>
                            <MenuItem value={'4vg4rvf4lci8goqy'}>D2 - Tim McCarver</MenuItem>

                            <MenuItem value={'5i7097l4lci8h8hx'}>D3 - Charlie Hough</MenuItem>
                            <MenuItem value={'mlhrcb1hlci8h56s'}>D3 - Hoyt Wilhelm</MenuItem>
                            <MenuItem value={'26eoxjgblci8gs4q'}>D3 - Phil Niekro</MenuItem>
                            <MenuItem value={'ld3pwp1alci8gvdi'}>D3 - R.A. Dickey</MenuItem>
                            <MenuItem value={'18vv6tuylci8gz06'}>D3 - Tim Wakefield</MenuItem>
                            <MenuItem value={'qm1f6p3glci8h225'}>D3 - Tom Candiotti</MenuItem>

                            <MenuItem value={'71ffs8fqlci8hbk4'}>D4 - Bill Dahlen</MenuItem>
                            <MenuItem value={'pdqu6y6glci8heom'}>D4 - Shoeless Joe Jackson</MenuItem>
                            <MenuItem value={'izk0kwpalci8hi7o'}>D4 - Pete Browning</MenuItem>
                            <MenuItem value={'yok9eqt1lci8hl7h'}>D4 - Cupid Childs</MenuItem>
                            <MenuItem value={'wel1ffjzlci8holo'}>D4 - Fielder Jones</MenuItem>
                            <MenuItem value={'diudb961lci8hrlz'}>D4 - Sherry Magee</MenuItem>
                            <MenuItem value={'h9cwytrflci8huvy'}>D4 - The Only Nolan</MenuItem>
                            <MenuItem value={'av4hwhyulci8hxw5'}>D4 - Tommy Leach</MenuItem>
                            <MenuItem value={'8w86c7mtlci8i12k'}>D4 - Lave Cross</MenuItem>
                            <MenuItem value={'dnl2pkxylci8i4h1'}>D4 - Harry Stovey</MenuItem>
                            <MenuItem value={'oisr0gvnlci8i9k3'}>D4 - Ed Konetchy</MenuItem>
                            <MenuItem value={'6ahuaat5lci8iclu'}>D4 - Jimmy Sheckard</MenuItem>
                            <MenuItem value={'25qo4fs9lci8ifok'}>D4 - Jake Daubert</MenuItem>
                            <MenuItem value={'7xpvgr5zlci8iitc'}>D4 - Tony Mullane</MenuItem>
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
