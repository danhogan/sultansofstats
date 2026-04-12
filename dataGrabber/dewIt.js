import fetch from "node-fetch";
import fs from 'fs';

import { leagueIds, getDivision } from './divisions.js';
import { categories } from './categories.js';

const LOWER_IS_BETTER = new Set(['ERA', 'WHP']);
const OUTPUT_PATH = '../src/lib/data/allTheData.json';
const TIE_PENALTY = 0.5;

// All per-division config in one place.
// superDivisionRank:    teams at or above this division rank earn "super" promotion (skip a division).
// promotionLeagueRank:  teams at or above this league rank earn normal promotion.
// relegationLeagueRank: teams at or below this league rank are relegated.
// crossDivSlots:        extra promotion slots opened in this division by super-promotions above.
const DIVISION_CONFIG = {
    1: { relegationLeagueRank: 7 },
    2: { promotionLeagueRank: 2, relegationLeagueRank: 8, crossDivSlots: 3 },
    3: { superDivisionRank: 1, promotionLeagueRank: 2, relegationLeagueRank: 8, crossDivSlots: 4 },
    4: { superDivisionRank: 2, promotionLeagueRank: 2, crossDivSlots: 15 },
};

const DIVISION_IDS = Object.keys(DIVISION_CONFIG).map(Number);

// --- Fantrax API ---

async function fetchLeagueStandings(leagueId) {
    const res = await fetch(`https://www.fantrax.com/fxpa/req?leagueId=${leagueId}`, {
        method: 'POST',
        body: JSON.stringify({ msgs: [{ method: 'getStandings', data: { leagueId } }] }),
        headers: { 'Content-Type': 'application/json' },
    });
    return res.json();
}

function parseLeagueTeams(leagueResponse) {
    const data = leagueResponse.responses[0].data;
    const leagueName = data.miscData.heading;

    return data.tableList[3].rows.map((team) => {
        const leagueId = team.fixedCells[1].leagueId;
        return {
            teamName: team.fixedCells[1].content,
            teamId: team.fixedCells[1].teamId,
            leagueName,
            leagueId,
            leagueRank: Number(team.fixedCells[0].content),
            division: getDivision(leagueId),
            stats: Object.fromEntries(
                categories.map((cat) => [
                    cat.dataName,
                    Number(team.cells[cat.fantraxCellId].toolTip.replace(/,/g, '')) || 0,
                ])
            ),
        };
    });
}

// --- Ranking ---

// Builds { R: [sorted values], HR: [...], ... } for a set of teams.
// Values are sorted best-first, so indexOf(value) gives the 0-based rank.
function buildSortedStatArrays(teams) {
    const arrays = Object.fromEntries(categories.map((cat) => [cat.dataName, []]));

    for (const team of teams) {
        for (const cat of categories) {
            arrays[cat.dataName].push(team.stats[cat.dataName]);
        }
    }

    for (const cat of categories) {
        const key = cat.dataName;
        arrays[key].sort(LOWER_IS_BETTER.has(key) ? (a, b) => a - b : (a, b) => b - a);
    }

    return arrays;
}

// Points for a stat value: total count minus its 0-based rank.
// Division scoring penalizes ties by TIE_PENALTY per duplicate beyond the first.
function calcPoints(value, sortedValues, total, penalizeTies = false) {
    const points = total - sortedValues.indexOf(value);
    if (!penalizeTies) return points;
    const ties = sortedValues.filter((v) => v === value).length;
    return points + (ties - 1) * -TIE_PENALTY;
}

function addStatPoints(teams) {
    const overallSorted = buildSortedStatArrays(teams);
    const byDivision = DIVISION_IDS.map((d) => teams.filter((t) => t.division === d));
    const divisionSorted = byDivision.map(buildSortedStatArrays);
    const divisionCounts = byDivision.map((d) => d.length);

    return teams.map((team) => {
        const divIdx = team.division - 1;
        const divSorted = divisionSorted[divIdx];
        const divTotal = divisionCounts[divIdx];

        const statValues = Object.fromEntries(
            categories.map((cat) => [
                cat.dataName,
                calcPoints(team.stats[cat.dataName], overallSorted[cat.dataName], teams.length),
            ])
        );

        const divisionValues = Object.fromEntries(
            categories.map((cat) => [
                cat.dataName,
                calcPoints(team.stats[cat.dataName], divSorted[cat.dataName], divTotal, true),
            ])
        );

        return {
            ...team,
            statValues,
            divisionValues,
            totalPoints: Object.values(statValues).reduce((a, b) => a + b, 0),
            divisionPoints: Object.values(divisionValues).reduce((a, b) => a + b, 0),
        };
    });
}

function addRankings(teams) {
    const byTotal = [...teams].sort((a, b) => b.totalPoints - a.totalPoints);
    const byDivision = [...teams].sort((a, b) => b.divisionPoints - a.divisionPoints);

    return teams.map((team) => ({
        ...team,
        overallRank: byTotal.findIndex((t) => t.totalPoints === team.totalPoints) + 1,
        divisionRank:
            byDivision
                .filter((t) => t.division === team.division)
                .findIndex((t) => t.divisionPoints === team.divisionPoints) + 1,
    }));
}

// --- Promotion / relegation ---

// First pass: determine promotion status from each team's own standing.
// "super" = skip a division (D3 #1 overall goes to D1, D4 top 2 overall go to D2).
// super overrides any league-rank-based result for D3/D4.
function getInitialPromotion({ division, leagueRank, divisionRank }) {
    const rules = DIVISION_CONFIG[division];
    if (rules.superDivisionRank !== undefined && divisionRank <= rules.superDivisionRank) return 'super';
    if (rules.promotionLeagueRank !== undefined && leagueRank <= rules.promotionLeagueRank) return 'promotion';
    if (rules.relegationLeagueRank !== undefined && leagueRank >= rules.relegationLeagueRank) return 'relegation';
    return '';
}

// Returns a Set of teamIds for the best N non-promoted teams in a division.
function bestNonPromotedIds(teams, division, n) {
    return new Set(
        teams
            .filter((t) => t.division === division && t.promotion !== 'promotion' && t.promotion !== 'super')
            .sort((a, b) => a.divisionRank - b.divisionRank)
            .slice(0, n)
            .map((t) => t.teamId)
    );
}

function addPromotion(teams) {
    // First pass: status based on each team's own standing.
    const withInitialPromo = teams.map((team) => ({
        ...team,
        promotion: getInitialPromotion(team),
    }));

    // Second pass: cross-division promotions.
    // Super-promotions open up extra slots in the divisions below, letting additional
    // non-promoting teams earn promotion. The best relegated D2 team is also un-relegated,
    // since the D3 super-promotee fills what would have been their D1 relegation slot.
    const crossDivPromotions = new Set(
        Object.entries(DIVISION_CONFIG)
            .filter(([, { crossDivSlots }]) => crossDivSlots)
            .flatMap(([div, { crossDivSlots }]) =>
                [...bestNonPromotedIds(withInitialPromo, Number(div), crossDivSlots)]
            )
    );

    const bestRelegatedD2Id = withInitialPromo
        .filter((t) => t.division === 2 && t.promotion === 'relegation')
        .sort((a, b) => a.divisionRank - b.divisionRank)[0]?.teamId;

    return withInitialPromo.map((team) => {
        let promotion = team.promotion;
        if (crossDivPromotions.has(team.teamId)) promotion = 'promotion';
        if (team.teamId === bestRelegatedD2Id) promotion = '';
        return { ...team, promotion };
    });
}

// --- Main ---
// Modified by IAmABulldozer: Added statsHistory accumulation.
// Each daily run now reads the existing allTheData.json to preserve
// each team's historical stat values, appends today's stats, and
// writes it all back. This feeds the charts feature on /charts.
// --- Main ---

try {
    // Read existing data to preserve statsHistory
    let existingHistory = {};
    try {
        const existing = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8'));
        for (const team of existing.theData) {
            existingHistory[team.teamId] = team.statsHistory || {};
        }
    } catch {
        // No existing file yet, start fresh
    }

    const leagueResponses = await Promise.all(leagueIds.map(fetchLeagueStandings));
    const teams = leagueResponses.flatMap(parseLeagueTeams);
    const withPoints = addStatPoints(teams);
    const withRankings = addRankings(withPoints);
    const withPromotion = addPromotion(withRankings);

    // Append today's stats to each team's history
    // History shape: { R: [{date, value}, ...], HR: [...], ... }
    // Append today's stats to each team's history
    const today = new Date().toISOString().split('T')[0];
    const withHistory = withPromotion.map((team) => {
        const history = existingHistory[team.teamId] || {};
        for (const cat of categories) {
            if (!history[cat.dataName]) history[cat.dataName] = [];
            history[cat.dataName].push({ date: today, value: team.stats[cat.dataName] });
        }
        return { ...team, statsHistory: history };
    });

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify({
        theData: withHistory,
        updateDate: Date.now(),
    }));

    console.log(`Updated ${withPromotion.length} teams → ${OUTPUT_PATH}`);
} catch (err) {
    console.error('Failed to update data:', err);
    process.exit(1);
}
