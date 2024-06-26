import fetch from "node-fetch";
import fs from 'fs';

import file from '../src/allTheData.json' with { type: "json" };
import { leagueIds, getDivision } from './divisions.js';
import { categories } from './categories.js';

const doTheDew = async function (leagueId) {
    const body = { msgs: [{ method: "getStandings", data: { leagueId: leagueId } }] };

    //https://www.fantrax.com/fantasy/league/rdjea3rslck02h24/standings
    const response = await fetch(`https://www.fantrax.com/fxpa/req?leagueId=${leagueId}`, {
        method: 'post',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    });
    return await response.json();
}

//Get all league data
const promises = leagueIds.map((leagueId) => {
    return doTheDew(leagueId);
});

Promise.all(promises).then((data) => {
    //Format league data that we will need
    const allStats = data.map((league) => {
        return league.responses[0].data.tableList[3].rows.map((team) => {
            return {
                teamName: team.fixedCells[1].content,
                teamId: team.fixedCells[1].teamId,
                leagueName: league.responses[0].data.miscData.heading,
                leagueId: team.fixedCells[1].leagueId,
                leagueRank: parseInt(team.fixedCells[0].content), //not sure about this one
                division: getDivision(team.fixedCells[1].leagueId),
                stats: categories.reduce((acc, stat) => {
                    acc[stat.dataName] = Number(team.cells[stat.fantraxCellId].toolTip.replace(/\,/g, '')) || 0;
                    return acc;
                }, {})
                //rework for first and second day of season. Day 1 - no statsHistory, Day 2 - statsHistory doesn't exist yet, then we're good
                // statsHistory: {
                //     R: [...file.theData.filter(x => x.teamId == team.fixedCells[1].teamId)[0].statsHistory.R, Number(team.cells[6].toolTip.replace(/\,/g, '')) || 0],
                //     HR: [...file.theData.filter(x => x.teamId == team.fixedCells[1].teamId)[0].statsHistory.HR, Number(team.cells[7].toolTip.replace(/\,/g, '')) || 0],
                //     RBI: [...file.theData.filter(x => x.teamId == team.fixedCells[1].teamId)[0].statsHistory.RBI, Number(team.cells[8].toolTip.replace(/\,/g, '')) || 0],
                //     SB: [...file.theData.filter(x => x.teamId == team.fixedCells[1].teamId)[0].statsHistory.SB, Number(team.cells[9].toolTip.replace(/\,/g, '')) || 0],
                //     OBP: [...file.theData.filter(x => x.teamId == team.fixedCells[1].teamId)[0].statsHistory.OBP, Number(team.cells[10].toolTip.replace(/\,/g, '')) || 0],
                //     OPS: [...file.theData.filter(x => x.teamId == team.fixedCells[1].teamId)[0].statsHistory.OPS, Number(team.cells[11].toolTip.replace(/\,/g, '')) || 0],
                //     WQS: [...file.theData.filter(x => x.teamId == team.fixedCells[1].teamId)[0].statsHistory.WQS, Number(team.cells[13].toolTip.replace(/\,/g, '')) || 0],
                //     K: [...file.theData.filter(x => x.teamId == team.fixedCells[1].teamId)[0].statsHistory.K, Number(team.cells[14].toolTip.replace(/\,/g, '')) || 0],
                //     K9: [...file.theData.filter(x => x.teamId == team.fixedCells[1].teamId)[0].statsHistory.K9, Number(team.cells[16].toolTip.replace(/\,/g, '')) || 0],
                //     SVHLD: [...file.theData.filter(x => x.teamId == team.fixedCells[1].teamId)[0].statsHistory.SVHLD, Number(team.cells[15].toolTip.replace(/\,/g, '')) || 0],
                //     ERA: [...file.theData.filter(x => x.teamId == team.fixedCells[1].teamId)[0].statsHistory.ERA, Number(team.cells[17].toolTip.replace(/\,/g, '')) || 0],
                //     WHP: [...file.theData.filter(x => x.teamId == team.fixedCells[1].teamId)[0].statsHistory.WHP, Number(team.cells[18].toolTip.replace(/\,/g, '')) || 0],
                // }
            }
        });
    });

    //Merge all leagues to same array
    const statsTogether = [].concat(...allStats);

    const teamCount = statsTogether.length;
    const divisionCounts = [
        statsTogether.filter(x => x.division == 1).length,
        statsTogether.filter(x => x.division == 2).length,
        statsTogether.filter(x => x.division == 3).length,
        statsTogether.filter(x => x.division == 4).length,
    ];
    const divisionStats = [
        statsTogether.filter(x => x.division == 1),
        statsTogether.filter(x => x.division == 2),
        statsTogether.filter(x => x.division == 3),
        statsTogether.filter(x => x.division == 4),
    ];

    class statObjectClass {
        constructor() {
            this.R = [];
            this.HR = [];
            this.RBI = [];
            this.SB = [];
            this.OBP = [];
            this.OPS = [];
            this.WQS = [];
            this.K = [];
            this.K9 = [];
            this.SVHLD = [];
            this.ERA = [];
            this.WHP = [];
        }
    }

    //Put all stats in category-specific arrays for ranking
    let statObject = new statObjectClass();
    statsTogether.forEach((team) => {
        categories.forEach((stat) => {
            statObject[stat.dataName].push(team.stats[stat.dataName])
        })
    });

    //Put all division-specific stats in category-specific arrays for division rankings
    let allDivisionStats = divisionStats.map((division) => {
        let divisionStatObject = new statObjectClass();

        division.forEach((team) => {
            categories.forEach((stat) => {
                divisionStatObject[stat.dataName].push(team.stats[stat.dataName])
            })
        });

        return divisionStatObject;
    });

    //Sort arrays used for rankings
    for (const [key, value] of Object.entries(statObject)) {
        if (key == 'ERA' || key == 'WHP') { //lower is better
            statObject[key] = value.sort((a, b) => a - b);
        } else {
            statObject[key] = value.sort((a, b) => b - a);
        }
    }

    //Sort all division-specific arrays used for rankings
    allDivisionStats.forEach((division) => {
        for (const [key, value] of Object.entries(division)) {
            if (key == 'ERA' || key == 'WHP') { //lower is better
                division[key] = value.sort((a, b) => a - b);
            } else {
                division[key] = value.sort((a, b) => b - a);
            }
        }
    });

    //Get overall ranking point value for each specific stat
    const withValues = statsTogether.map((team) => {
        return {
            statValues: categories.reduce((acc, stat) => {
                acc[stat.dataName] = teamCount - statObject[stat.dataName].indexOf(team.stats[stat.dataName]);
                return acc;
            }, {}),
            ...team
        }
    });

    //Get division-specific ranking point value for each specific stat
    const divisionValues = withValues.map((team) => {
        let localDivisionCount = divisionCounts[team.division - 1];
        let divisionStats = allDivisionStats[team.division - 1];

        const getPointValue = (statCat) => {
            let bonus = 0;
            let timesValueIsInArray = divisionStats[statCat].filter(x => x == team.stats[statCat]).length;
            bonus = (timesValueIsInArray - 1) * -0.5; //adjust points for categorical ties

            return localDivisionCount - divisionStats[statCat].indexOf(team.stats[statCat]) + bonus;
        }

        return {
            divisionValues: categories.reduce((acc, stat) => {
                acc[stat.dataName] = getPointValue(stat.dataName);
                return acc;
            }, {}),
            ...team
        }
    });

    //Calculate/add overall and division point totals
    const withTotal = divisionValues.map((team) => {
        return {
            ...team,
            totalPoints: Object.values(team.statValues).reduce((a, b) => a + b),
            divisionPoints: Object.values(team.divisionValues).reduce((a, b) => a + b),
        }
    });

    const sortedByTotalPoints = [...withTotal].sort((a, b) => (a.totalPoints < b.totalPoints) ? 1 : -1);
    const sortedByDivisionPoints = [...withTotal].sort((a, b) => (a.divisionPoints < b.divisionPoints) ? 1 : -1);

    //Calculate/add overall and division rankings based on point totals
    const withOverallRanking = sortedByTotalPoints.map((team) => {
        return {
            ...team,
            overallRank: sortedByTotalPoints.findIndex(x => x.totalPoints === team.totalPoints) + 1,
            divisionRank: sortedByDivisionPoints.filter(y => y.division === team.division).findIndex(x => x.divisionPoints === team.divisionPoints) + 1
        }
    });

    //wow this promotion stuff is bad
    let promotionStuff = withOverallRanking.map((team) => {
        let promo = '';

        if (team.division === 1 && team.leagueRank >= 7) {
            promo = 'relegation';
        }

        if (team.division === 2) {
            if (team.leagueRank <= 2) {
                promo = 'promotion';
            }

            if (team.leagueRank >= 8) {
                promo = 'relegation';
            }
        }

        if (team.division === 3) {
            if (team.leagueRank <= 2) {
                promo = 'promotion';
            }

            if (team.leagueRank >= 8) {
                promo = 'relegation';
            }

            if (team.divisionRank === 1) {
                promo = 'super';
            }
        }

        if (team.division === 4) {
            if (team.leagueRank <= 2) {
                promo = 'promotion';
            }

            if (team.divisionRank <= 2) {
                promo = 'super';
            }
        }

        return {
            teamId: team.teamId,
            overallRank: team.overallRank,
            divisionRank: team.divisionRank,
            division: team.division,
            promotion: promo
        }
    });

    function notPromoted(x) {
        return x.promotion != 'promotion' && x.promotion != 'super';
    }

    let d2Bums = promotionStuff
        .filter(y => y.division === 2)
        .filter(notPromoted)
        .sort((a, b) => (a.divisionRank > b.divisionRank) ? 1 : -1)
        .slice(0, 3);
    let d3Bums = promotionStuff
        .filter(y => y.division === 3)
        .filter(notPromoted)
        .sort((a, b) => (a.divisionRank > b.divisionRank) ? 1 : -1)
        .slice(0, 4);
    let d4Bums = promotionStuff
        .filter(y => y.division === 4)
        .filter(notPromoted)
        .sort((a, b) => (a.divisionRank > b.divisionRank) ? 1 : -1)
        .slice(0, 13);

    function yesRelegated(x) {
        return x.promotion == 'relegation';
    }

    let d2SuperBums = promotionStuff
        .filter(y => y.division === 2)
        .filter(yesRelegated)
        .sort((a, b) => (a.divisionRank > b.divisionRank) ? 1 : -1)
        .slice(0, 1);

    const morePromotionStuff = withOverallRanking.map((team) => {
        let promo = promotionStuff.filter(x => x.teamId == team.teamId)[0].promotion;

        d2Bums.forEach((bum) => {
            if (bum.teamId == team.teamId) {
                promo = 'promotion';
            }
        });

        d2SuperBums.forEach((bum) => {
            if (bum.teamId == team.teamId) {
                promo = '';
            }
        });

        d3Bums.forEach((bum) => {
            if (bum.teamId == team.teamId) {
                promo = 'promotion';
            }
        });

        d4Bums.forEach((bum) => {
            if (bum.teamId == team.teamId) {
                promo = 'promotion';
            }
        });

        return {
            ...team,
            promotion: promo
        }
    });

    const withDate = {
        theData: morePromotionStuff,
        updateDate: Date.now()
    }

    fs.writeFileSync(`../src/allTheData.json`, JSON.stringify(withDate));
});
