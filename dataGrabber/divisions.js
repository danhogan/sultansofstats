const d1List = ['fmsw2r2blci8ghpy'];
const d2List = [
    '5u9acbwjlci8gl0h',
    'e157klkilci8gcwq',
    '4vg4rvf4lci8goqy',
];
const d3List = [
    '5i7097l4lci8h8hx',
    'mlhrcb1hlci8h56s',
    '26eoxjgblci8gs4q',
    'ld3pwp1alci8gvdi',
    '18vv6tuylci8gz06',
    'qm1f6p3glci8h225',
];
const d4List = [
    '71ffs8fqlci8hbk4',
    'yok9eqt1lci8hl7h',
    'wel1ffjzlci8holo',
    'dnl2pkxylci8i4h1',
    '8w86c7mtlci8i12k',
    'izk0kwpalci8hi7o',
    'diudb961lci8hrlz',
    'pdqu6y6glci8heom',
    'h9cwytrflci8huvy',
    'av4hwhyulci8hxw5',
];
const leagueIds = [...d1List, ...d2List, ...d3List, ...d4List];

const getDivision = ((leagueId) => {
    if (d1List.includes(leagueId)) {
        return 1;
    }

    if (d2List.includes(leagueId)) {
        return 2;
    }

    if (d3List.includes(leagueId)) {
        return 3;
    }

    return 4;
});

module.exports = {
    leagueIds,
    getDivision
}