import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export default function ToggleButtons(props: any) {
    const [divisionFilter, setDivisionFilter] = React.useState<number>(0);

    const handleDivisionFilter = (event: React.MouseEvent<HTMLElement>, newDivisionFitler: number) => {
        if (newDivisionFitler !== null) {
            setDivisionFilter(newDivisionFitler);
            props.emitDivisionFilter(newDivisionFitler);
        }
    };

    return (
        <ToggleButtonGroup value={divisionFilter} exclusive onChange={handleDivisionFilter} aria-label="division filter">
            <ToggleButton value={0} aria-label="all">
                All
            </ToggleButton>
            <ToggleButton value={1} aria-label="D1">
                D1
            </ToggleButton>
            <ToggleButton value={2} aria-label="D2">
                D2
            </ToggleButton>
            <ToggleButton value={3} aria-label="D3">
                D3
            </ToggleButton>
            <ToggleButton value={4} aria-label="D4">
                D4
            </ToggleButton>
        </ToggleButtonGroup>
    );
}
