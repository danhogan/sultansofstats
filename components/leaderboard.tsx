import * as React from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import Chip from "@mui/material/Chip";
import { green, orange, red, yellow, blue } from "@mui/material/colors";
import CircleIcon from "@mui/icons-material/Circle";

interface Data {
    teamName: string;
    leagueName: string;
    leagueRank: number;
    overallRank: number;
    divisionRank: number;
    totalPoints: number;
    divisionPoints: number;
    leagueId: number;
    teamId: number;
    promotion: string;

    R: number;
    HR: number;
    RBI: number;
    SB: number;
    OBP: number;
    OPS: number;
    WQS: number;
    K: number;
    K9: number;
    SVHLD: number;
    ERA: number;
    WHP: number;

    RRank: number;
    HRRank: number;
    RBIRank: number;
    SBRank: number;
    OBPRank: number;
    OPSRank: number;
    WQSRank: number;
    KRank: number;
    K9Rank: number;
    SVHLDRank: number;
    ERARank: number;
    WHPRank: number;

    divisionRRank: number;
    divisionHRRank: number;
    divisionRBIRank: number;
    divisionSBRank: number;
    divisionOBPRank: number;
    divisionOPSRank: number;
    divisionWQSRank: number;
    divisionKRank: number;
    divisionK9Rank: number;
    divisionSVHLDRank: number;
    divisionERARank: number;
    divisionWHPRank: number;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key
): (a: { [key in Key]: number }, b: { [key in Key]: number }) => number {
    return order === "desc" ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    numeric: boolean;
}

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
    headCells: HeadCell[];
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headCells } = props;
    const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell: HeadCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? "right" : "left"}
                        padding={headCell.disablePadding ? "none" : "normal"}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : "asc"}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === "desc" ? "sorted descending" : "sorted ascending"}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

export default function EnhancedTable(props: any) {
    const [order, setOrder] = React.useState<Order>("asc");
    const [orderBy, setOrderBy] = React.useState<keyof Data>("overallRank");
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(300);

    const overallBool: boolean = props.statValueLocation === "statValues";
    // const divisionAdd: string = overallBool ? "" : "division";

    const headCells: HeadCell[] = [
        {
            id: "teamName",
            numeric: false,
            disablePadding: false,
            label: "Team Name",
        },
        {
            id: "leagueName",
            numeric: false,
            disablePadding: false,
            label: "League",
        },
        {
            id: "leagueRank",
            numeric: true,
            disablePadding: false,
            label: "League Rank",
        },
        {
            id: overallBool ? "overallRank" : "divisionRank",
            numeric: true,
            disablePadding: false,
            label: overallBool ? "Overall Rank" : "Division Rank",
        },
        {
            id: overallBool ? "totalPoints" : "divisionPoints",
            numeric: true,
            disablePadding: false,
            label: overallBool ? "Total Points" : "Division Points",
        },

        {
            id: "R",
            numeric: true,
            disablePadding: false,
            label: "R",
        },
        {
            id: "HR",
            numeric: true,
            disablePadding: false,
            label: "HR",
        },
        {
            id: "RBI",
            numeric: true,
            disablePadding: false,
            label: "RBI",
        },
        {
            id: "SB",
            numeric: true,
            disablePadding: false,
            label: "SB",
        },
        {
            id: "OBP",
            numeric: true,
            disablePadding: false,
            label: "OBP",
        },
        {
            id: "OPS",
            numeric: true,
            disablePadding: false,
            label: "OPS",
        },
        {
            id: "WQS",
            numeric: true,
            disablePadding: false,
            label: "W+QS",
        },
        {
            id: "K",
            numeric: true,
            disablePadding: false,
            label: "K",
        },
        {
            id: "K9",
            numeric: true,
            disablePadding: false,
            label: "K/9",
        },
        {
            id: "SVHLD",
            numeric: true,
            disablePadding: false,
            label: "SV+HLD",
        },
        {
            id: "ERA",
            numeric: true,
            disablePadding: false,
            label: "ERA",
        },
        {
            id: "WHP",
            numeric: true,
            disablePadding: false,
            label: "WHP",
        },
    ];

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
        if (["overallRank", "leagueRank", "leagueName", "teamName", "divisionRank"].includes(property)) {
            const isAsc = orderBy === property && order === "asc";
            setOrder(isAsc ? "desc" : "asc");
        } else {
            const isAsc = orderBy === property && order === "desc";
            setOrder(isAsc ? "asc" : "desc");
        }

        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n: { teamName: any }) => n.teamName);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, name: any) => {
        //"any" was and I guess should be "string"
        const selectedIndex = selected.indexOf(name);
        let newSelected: readonly string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (name: any) => selected.indexOf(name) !== -1; //"any" was and I guess should be "string"

    const regularRows: any = props.data;
    //making things happy with this trashy "flattening"
    const rows = regularRows.map((row: any) => {
        return {
            ...row,
            R: row.stats.R,
            HR: row.stats.HR,
            RBI: row.stats.RBI,
            SB: row.stats.SB,
            OBP: row.stats.OBP,
            OPS: row.stats.OPS,
            WQS: row.stats.WQS,
            K: row.stats.K,
            K9: row.stats.K9,
            SVHLD: row.stats.SVHLD,
            ERA: row.stats.ERA,
            WHP: row.stats.WHP,

            RRank: row.statValues.R,
            HRRank: row.statValues.HR,
            RBIRank: row.statValues.RBI,
            SBRank: row.statValues.SB,
            OBPRank: row.statValues.OBP,
            OPSRank: row.statValues.OPS,
            WQSRank: row.statValues.WQS,
            KRank: row.statValues.K,
            K9Rank: row.statValues.K9,
            SVHLDRank: row.statValues.SVHLD,
            ERARank: row.statValues.ERA,
            WHPRank: row.statValues.WHP,

            divisionRRank: row.divisionValues.R,
            divisionHRRank: row.divisionValues.HR,
            divisionRBIRank: row.divisionValues.RBI,
            divisionSBRank: row.divisionValues.SB,
            divisionOBPRank: row.divisionValues.OBP,
            divisionOPSRank: row.divisionValues.OPS,
            divisionWQSRank: row.divisionValues.WQS,
            divisionKRank: row.divisionValues.K,
            divisionK9Rank: row.divisionValues.K9,
            divisionSVHLDRank: row.divisionValues.SVHLD,
            divisionERARank: row.divisionValues.ERA,
            divisionWHPRank: row.divisionValues.WHP,
        };
    });

    //should just be number, but whatever
    function getColor(rank: any) {
        let dataCount = rows.length;

        if (rank / dataCount < 0.1) return { backgroundColor: red[900] };
        if (rank / dataCount < 0.25) return { backgroundColor: red[700] };
        if (rank / dataCount < 0.4) return { backgroundColor: red[500] };
        if (rank / dataCount < 0.55) return { backgroundColor: orange[600], color: "#000" };
        if (rank / dataCount < 0.7) return { backgroundColor: yellow[700], color: "#000" };
        if (rank / dataCount < 0.85) return { backgroundColor: green[300], color: "#000" };
        return { backgroundColor: green[500], color: "#000" };
    }

    function getPromoColor(promoCode: string): string {
        if (promoCode == "super") return blue[500];
        else if (promoCode == "promotion") return green[500];
        else if (promoCode == "relegation") return red[500];
        else return yellow[700];
    }

    function getPromoText(promo: string): string {
        switch (promo) {
            case "super":
                return "Set for double promotion";
            case "promotion":
                return "Set for promotion";
            case "relegation":
                return "Set for relegation";
            default:
                return "Set to stay put";
        }
    }

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <Box sx={{ width: "100%" }}>
            <Paper sx={{ width: "100%", mb: 2 }}>
                <TableContainer style={{ overflowX: "initial" }}>
                    <Table stickyHeader sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="small" aria-label="sticky table">
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                            headCells={headCells}
                        />
                        <TableBody>
                            {/* if you don't need to support IE11, you can replace the `stableSort` call with:
              rows.slice().sort(getComparator(order, orderBy)) */}
                            {rows
                                .slice()
                                .sort(getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row: Data, index: number) => {
                                    const isItemSelected = isSelected(row.teamName);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => handleClick(event, row.teamName)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={`${row.teamName}-${row.leagueName}`}
                                            selected={isItemSelected}
                                        >
                                            <TableCell component="th" id={labelId} scope="row">
                                                {/* <Tooltip title={getPromoText(row.promotion)} placement="top">
                                                    <CircleIcon
                                                        style={{
                                                            color: getPromoColor(row.promotion),
                                                            fontSize: "1.1em",
                                                            marginRight: "0.3em",
                                                            verticalAlign: "middle",
                                                        }}
                                                    ></CircleIcon>
                                                </Tooltip> */}
                                                <a
                                                    target="_blank"
                                                    href={`https://www.fantrax.com/fantasy/league/${row.leagueId}/team/roster;teamId=${row.teamId}`}
                                                >
                                                    {row.teamName}
                                                </a>
                                            </TableCell>
                                            <TableCell align="right">
                                                <a target="_blank" href={`https://www.fantrax.com/fantasy/league/${row.leagueId}/standings`}>
                                                    {row.leagueName}
                                                </a>
                                            </TableCell>
                                            <TableCell align="right">{row.leagueRank}</TableCell>
                                            <TableCell align="right">{overallBool ? row.overallRank : row.divisionRank}</TableCell>
                                            <TableCell align="right">{overallBool ? row.totalPoints : row.divisionPoints}</TableCell>

                                            <TableCell align="right">
                                                <Chip
                                                    label={`${row.R} (${overallBool ? row.RRank : row.divisionRRank})`}
                                                    style={getColor(overallBool ? row.RRank : row.divisionRRank)}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={`${row.HR} (${overallBool ? row.HRRank : row.divisionHRRank})`}
                                                    style={getColor(overallBool ? row.HRRank : row.divisionHRRank)}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={`${row.RBI} (${overallBool ? row.RBIRank : row.divisionRBIRank})`}
                                                    style={getColor(overallBool ? row.RBIRank : row.divisionRBIRank)}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={`${row.SB} (${overallBool ? row.SBRank : row.divisionSBRank})`}
                                                    style={getColor(overallBool ? row.SBRank : row.divisionSBRank)}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={`${row.OBP.toFixed(3)} (${overallBool ? row.OBPRank : row.divisionOBPRank
                                                        })`}
                                                    style={getColor(overallBool ? row.OBPRank : row.divisionOBPRank)}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={`${row.OPS.toFixed(3)} (${overallBool ? row.OPSRank : row.divisionOPSRank
                                                        })`}
                                                    style={getColor(overallBool ? row.OPSRank : row.divisionOPSRank)}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={`${row.WQS} (${overallBool ? row.WQSRank : row.divisionWQSRank})`}
                                                    style={getColor(overallBool ? row.WQSRank : row.divisionWQSRank)}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={`${row.K} (${overallBool ? row.KRank : row.divisionKRank})`}
                                                    style={getColor(overallBool ? row.KRank : row.divisionKRank)}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={`${row.K9.toFixed(3)} (${overallBool ? row.K9Rank : row.divisionK9Rank})`}
                                                    style={getColor(overallBool ? row.K9Rank : row.divisionK9Rank)}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={`${row.SVHLD} (${overallBool ? row.SVHLDRank : row.divisionSVHLDRank})`}
                                                    style={getColor(overallBool ? row.SVHLDRank : row.divisionSVHLDRank)}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={`${row.ERA.toFixed(2)} (${overallBool ? row.ERARank : row.divisionERARank})`}
                                                    style={getColor(overallBool ? row.ERARank : row.divisionERARank)}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={`${row.WHP.toFixed(3)} (${overallBool ? row.WHPRank : row.divisionWHPRank})`}
                                                    style={getColor(overallBool ? row.WHPRank : row.divisionWHPRank)}
                                                />
                                            </TableCell>

                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: 33 * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[{ value: -1, label: "All" }]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}
