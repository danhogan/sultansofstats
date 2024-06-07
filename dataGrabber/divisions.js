const d1List = ['e3px47n0lr7xx2y9'];
const d2List = [
    '88ggwnu4lr7xxkg8',
    '7vlt8wtklr7xxtne',
    '77en7xmelr7xy3n1',
];
const d3List = [
    'y6zp4bfslr7xyfbe',
    'kpc4liy3lr7xyner',
    'wm8ixb3flr7y4vh5',
    '838h7q3plr7xz1nt',
    '24f5ki4tlr7xza1j',
    'ou1xzkfplr7xzie8',
    'ls0uwwrqlr7xyuss',
];
const d4List = [
    '3y3ol2vzlr7xzq5s',
    'yr8kla9jlr7y38vm',
    'mb8xviqylr7y2zvv',
    'd9idp3pzlr7y2p5d',
    'qnyleexplr7y2dze',
    'di1qgcmtlr7y2489',
    'scq69b6xlr7y1suk',
    'f168202alr7y1egz',
    'b3xezupjlr7y17rx',
    'kydzgf8clr7y0zue',
    '2xpo8hpflr7y0om1',
];

export const leagueIds = [...d1List, ...d2List, ...d3List, ...d4List];

export const getDivision = ((leagueId) => {
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