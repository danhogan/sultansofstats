const d1List = ['o7ppjql4ml9mhh5c'];
const d2List = [
    '373dbcceml9mhqmp',
    'pg3opey7ml9mhw05',
    '3op4bs4iml9mi2ea',
];
const d3List = [
    'rue7t54mml9mi9s8',
    'p0gx6gkbml9mifya',
    '7f1y6pmzml9milq5',
    'u65ai1z4ml9mirfb',
    'b57dtpmtml9miwsy',
    'hzqyob52ml9mj2di',
    'fcwlgxjwml9mj929',
];
const d4List = [
    'rqanc5viml9mjdzx',
    'oa8rueelml9mjjqb',
    'zhvack1cml9mjp7f',
    'islofbagml9mjy59',
    'cq68tm7zml9mk3ts',
    'krai7tncml9mk8y9',
    '64rttw7iml9mke55',
    'd8x91j84ml9mkl4g',
    'bfsrkzjwml9mkqk1',
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
