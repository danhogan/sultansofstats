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
import jsonData from "../src/allTheData.json";
import Chip from "@mui/material/Chip";
import { green, orange, purple, red, yellow } from "@mui/material/colors";

interface Data {
    teamName: string;
    leagueName: string;
    leagueRank: number;
    overallRank: number;
    totalPoints: number;
    leagueId: number;
    teamId: number;

    HR: number;
    R: number;
    RBI: number;
    SB: number;
    OBP: number;
    OPS: number;
    SO: number;
    SV: number;
    HD: number;
    ERA: number;
    WHP: number;
    QS: number;

    HRRank: number;
    RRank: number;
    RBIRank: number;
    SBRank: number;
    OBPRank: number;
    OPSRank: number;
    SORank: number;
    SVRank: number;
    HDRank: number;
    ERARank: number;
    WHPRank: number;
    QSRank: number;
}

const regularRows: any = jsonData.theData;
//making things happy with this trashy "flattening"
const rows = regularRows.map((row: any) => {
    return {
        ...row,
        HR: row.stats.HR,
        R: row.stats.R,
        RBI: row.stats.RBI,
        SB: row.stats.SB,
        OBP: row.stats.OBP,
        OPS: row.stats.OPS,
        SO: row.stats.SO,
        SV: row.stats.SV,
        HD: row.stats.HD,
        ERA: row.stats.ERA,
        WHP: row.stats.WHP,
        QS: row.stats.QS,

        HRRank: row.statValues.HR,
        RRank: row.statValues.R,
        RBIRank: row.statValues.RBI,
        SBRank: row.statValues.SB,
        OBPRank: row.statValues.OBP,
        OPSRank: row.statValues.OPS,
        SORank: row.statValues.SO,
        SVRank: row.statValues.SV,
        HDRank: row.statValues.HD,
        ERARank: row.statValues.ERA,
        WHPRank: row.statValues.WHP,
        QSRank: row.statValues.QS,
    };
});

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
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
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

const headCells: readonly HeadCell[] = [
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
        id: "overallRank",
        numeric: true,
        disablePadding: false,
        label: "Overall Rank",
    },
    {
        id: "totalPoints",
        numeric: true,
        disablePadding: false,
        label: "Total Points",
    },

    {
        id: "HR",
        numeric: true,
        disablePadding: false,
        label: "HR",
    },
    {
        id: "R",
        numeric: true,
        disablePadding: false,
        label: "R",
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
        id: "SO",
        numeric: true,
        disablePadding: false,
        label: "SO",
    },
    {
        id: "SV",
        numeric: true,
        disablePadding: false,
        label: "SV",
    },
    {
        id: "HD",
        numeric: true,
        disablePadding: false,
        label: "HD",
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
    {
        id: "QS",
        numeric: true,
        disablePadding: false,
        label: "QS",
    },
];

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
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

//should just be number, but whatever
function getColor(rank: any) {
    let dataCount = rows.length;

    if (rank / dataCount < 0.1) return red[900];
    if (rank / dataCount < 0.25) return red[700];
    if (rank / dataCount < 0.4) return red[500];
    if (rank / dataCount < 0.55) return orange[600];
    if (rank / dataCount < 0.7) return yellow[700];
    if (rank / dataCount < 0.85) return green[300];
    return green[500];
}

export default function EnhancedTable() {
    const [order, setOrder] = React.useState<Order>("asc");
    const [orderBy, setOrderBy] = React.useState<keyof Data>("overallRank");
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(300);

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
        if (["overallRank", "leagueRank", "leagueName", "teamName"].includes(property)) {
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

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <Box sx={{ width: "100%" }}>
            <Paper sx={{ width: "100%", mb: 2 }}>
                <TableContainer>
                    <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="small">
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {/* if you don't need to support IE11, you can replace the `stableSort` call with:
              rows.slice().sort(getComparator(order, orderBy)) */}
                            {stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
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
                                            {/* <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        "aria-labelledby": labelId,
                                                    }}
                                                />
                                            </TableCell> */}
                                            <TableCell component="th" id={labelId} scope="row">
                                                <a
                                                    target="_blank"
                                                    href={`https://www.fleaflicker.com/mlb/leagues/${row.leagueId}/teams/${row.teamId}`}
                                                >
                                                    {row.teamName}
                                                </a>
                                            </TableCell>
                                            <TableCell align="right">
                                                <a target="_blank" href={`https://www.fleaflicker.com/mlb/leagues/${row.leagueId}`}>
                                                    {row.leagueName}
                                                </a>
                                            </TableCell>
                                            <TableCell align="right">{row.leagueRank}</TableCell>
                                            <TableCell align="right">{row.overallRank}</TableCell>
                                            <TableCell align="right">{row.totalPoints}</TableCell>

                                            <TableCell align="right">
                                                <Chip
                                                    label={`${row.HR} (${row.HRRank})`}
                                                    color="primary"
                                                    style={{ backgroundColor: getColor(row.HRRank) }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={`${row.R} (${row.RRank})`}
                                                    color="primary"
                                                    style={{ backgroundColor: getColor(row.RRank) }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={`${row.RBI} (${row.RBIRank})`}
                                                    color="primary"
                                                    style={{ backgroundColor: getColor(row.RBIRank) }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={`${row.SB} (${row.SBRank})`}
                                                    color="primary"
                                                    style={{ backgroundColor: getColor(row.SBRank) }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={`${row.OBP} (${row.OBPRank})`}
                                                    color="primary"
                                                    style={{ backgroundColor: getColor(row.OBPRank) }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={`${row.OPS} (${row.OPSRank})`}
                                                    color="primary"
                                                    style={{ backgroundColor: getColor(row.OPSRank) }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={`${row.SO} (${row.SORank})`}
                                                    color="primary"
                                                    style={{ backgroundColor: getColor(row.SORank) }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={`${row.SV} (${row.SVRank})`}
                                                    color="primary"
                                                    style={{ backgroundColor: getColor(row.SVRank) }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={`${row.HD} (${row.HDRank})`}
                                                    color="primary"
                                                    style={{ backgroundColor: getColor(row.HDRank) }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={`${row.ERA} (${row.ERARank})`}
                                                    color="primary"
                                                    style={{ backgroundColor: getColor(row.ERARank) }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={`${row.WHP} (${row.WHPRank})`}
                                                    color="primary"
                                                    style={{ backgroundColor: getColor(row.WHPRank) }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={`${row.QS} (${row.QSRank})`}
                                                    color="primary"
                                                    style={{ backgroundColor: getColor(row.QSRank) }}
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
