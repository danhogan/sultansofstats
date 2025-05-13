const d1List = ['oeegm2t4m7ewmnl6'];
const d2List = [
    '3az2bcjnm7ewn0b9',
    'gxmx1t3um7ewn7a1',
    't4cjjnulm7ewndgp',
];
const d3List = [
    '8n9ldjzvm7ewnn2k',
    'chn3s6m9m7ewo27e',
    'tnnth06vm7ewo9mf',
    'u21iy02fm7ewogf9',
    'pxb07xrsm6jhbxhw',
    'ey1q5b3xm7ewoor4',
    '4xazcv5ym7ewouqh',
];
const d4List = [
    'foela164m7ewp2wy',
    'k12b2q0dm7ewqm9h',
    'yxyc2mt9m7ewpa48',
    'c3kzuqjjm7ewpgi1',
    'l506xzfwm7ewpnx0',
    'xg7ifok1m7ewpupx',
    'ilhqvb49m7ewq4kl',
    'g5259ebum7ewqatw',
    '9u31mbr5m7ewqgon',
    'ozgq19tsm7ewqsf1',
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