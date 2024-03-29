const fetch = require("node-fetch");
const fs = require('fs');

const fileName = '../src/allTheData.json';
const file = require(fileName);

const { leagueIds, getDivision } = require('./divisions');

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
                leagueRank: team.fixedCells[0].content, //not sure about this one
                division: getDivision(team.fixedCells[1].leagueId),
                stats: {
                    R: Number(team.cells[6].toolTip.replace(/\,/g,'')) || 0,
                    HR: Number(team.cells[7].toolTip.replace(/\,/g,'')) || 0,
                    RBI: Number(team.cells[8].toolTip.replace(/\,/g,'')) || 0,
                    SB: Number(team.cells[9].toolTip.replace(/\,/g,'')) || 0,
                    OBP: Number(team.cells[10].toolTip.replace(/\,/g,'')) || 0,
                    OPS: Number(team.cells[11].toolTip.replace(/\,/g,'')) || 0,
                    QS: Number(team.cells[13].toolTip.replace(/\,/g,'')) || 0,
                    SO: Number(team.cells[14].toolTip.replace(/\,/g,'')) || 0,
                    SV: Number(team.cells[15].toolTip.replace(/\,/g,'')) || 0,
                    HD: Number(team.cells[16].toolTip.replace(/\,/g,'')) || 0,
                    ERA: Number(team.cells[17].toolTip.replace(/\,/g,'')) || 0,
                    WHP: Number(team.cells[18].toolTip.replace(/\,/g,'')) || 0,
                },
                //rework for first and second day of season. Day 1 - no statsHistory, Day 2 - statsHistory doesn't exist yet, then we're good
                statsHistory: {
                    R: [...file.theData.filter(x => x.teamId == team.fixedCells[1].teamId)[0].statsHistory.R, Number(team.cells[6].toolTip.replace(/\,/g,'')) || 0],
                    HR: [...file.theData.filter(x => x.teamId == team.fixedCells[1].teamId)[0].statsHistory.HR, Number(team.cells[7].toolTip.replace(/\,/g,'')) || 0],
                    RBI: [...file.theData.filter(x => x.teamId == team.fixedCells[1].teamId)[0].statsHistory.RBI, Number(team.cells[8].toolTip.replace(/\,/g,'')) || 0],
                    SB: [...file.theData.filter(x => x.teamId == team.fixedCells[1].teamId)[0].statsHistory.SB, Number(team.cells[9].toolTip.replace(/\,/g,'')) || 0],
                    OBP: [...file.theData.filter(x => x.teamId == team.fixedCells[1].teamId)[0].statsHistory.OBP, Number(team.cells[10].toolTip.replace(/\,/g,'')) || 0],
                    OPS: [...file.theData.filter(x => x.teamId == team.fixedCells[1].teamId)[0].statsHistory.OPS, Number(team.cells[11].toolTip.replace(/\,/g,'')) || 0],
                    QS: [...file.theData.filter(x => x.teamId == team.fixedCells[1].teamId)[0].statsHistory.QS, Number(team.cells[13].toolTip.replace(/\,/g,'')) || 0],
                    SO: [...file.theData.filter(x => x.teamId == team.fixedCells[1].teamId)[0].statsHistory.SO, Number(team.cells[14].toolTip.replace(/\,/g,'')) || 0],
                    SV: [...file.theData.filter(x => x.teamId == team.fixedCells[1].teamId)[0].statsHistory.SV, Number(team.cells[15].toolTip.replace(/\,/g,'')) || 0],
                    HD: [...file.theData.filter(x => x.teamId == team.fixedCells[1].teamId)[0].statsHistory.HD, Number(team.cells[16].toolTip.replace(/\,/g,'')) || 0],
                    ERA: [...file.theData.filter(x => x.teamId == team.fixedCells[1].teamId)[0].statsHistory.ERA, Number(team.cells[17].toolTip.replace(/\,/g,'')) || 0],
                    WHP: [...file.theData.filter(x => x.teamId == team.fixedCells[1].teamId)[0].statsHistory.WHP, Number(team.cells[18].toolTip.replace(/\,/g,'')) || 0],
                }
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
            this.HR = [];
            this.R = [];
            this.RBI = [];
            this.SB = [];
            this.OBP = [];
            this.OPS = [];
            this.SO = [];
            this.SV = [];
            this.HD = [];
            this.ERA = [];
            this.WHP = [];
            this.QS = [];
        }
    }

    //Put all stats in category-specific arrays for ranking
    let statObject = new statObjectClass();
    statsTogether.forEach((team) => {
        statObject.HR.push(team.stats.HR);
        statObject.R.push(team.stats.R);
        statObject.RBI.push(team.stats.RBI);
        statObject.SB.push(team.stats.SB);
        statObject.OBP.push(team.stats.OBP);
        statObject.OPS.push(team.stats.OPS);
        statObject.SO.push(team.stats.SO);
        statObject.SV.push(team.stats.SV);
        statObject.HD.push(team.stats.HD);
        statObject.ERA.push(team.stats.ERA);
        statObject.WHP.push(team.stats.WHP);
        statObject.QS.push(team.stats.QS);
    });

    //Put all division-specific stats in category-specific arrays for division rankings
    let allDivisionStats = divisionStats.map((division) => {
        let divisionStatObject = new statObjectClass();

        division.forEach((team) => {
            divisionStatObject.HR.push(team.stats.HR);
            divisionStatObject.R.push(team.stats.R);
            divisionStatObject.RBI.push(team.stats.RBI);
            divisionStatObject.SB.push(team.stats.SB);
            divisionStatObject.OBP.push(team.stats.OBP);
            divisionStatObject.OPS.push(team.stats.OPS);
            divisionStatObject.SO.push(team.stats.SO);
            divisionStatObject.SV.push(team.stats.SV);
            divisionStatObject.HD.push(team.stats.HD);
            divisionStatObject.ERA.push(team.stats.ERA);
            divisionStatObject.WHP.push(team.stats.WHP);
            divisionStatObject.QS.push(team.stats.QS);
        });

        return divisionStatObject;
    });

    //Sort arrays used for rankings
    for (const [key, value] of Object.entries(statObject)) {
        if (key == 'ERA' || key == 'WHP') {
            statObject[key] = value.sort((a, b) => a - b);
        } else {
            statObject[key] = value.sort((a, b) => b - a);
        }
    }

    //Sort all division-specific arrays used for rankings
    allDivisionStats.forEach((division) => {
        for (const [key, value] of Object.entries(division)) {
            if (key == 'ERA' || key == 'WHP') {
                division[key] = value.sort((a, b) => a - b);
            } else {
                division[key] = value.sort((a, b) => b - a);
            }
        }
    });

    //Get overall ranking point value for each specific stat
    const withValues = statsTogether.map((team) => {
        return {
            statValues: {
                HR: teamCount - statObject.HR.indexOf(team.stats.HR),
                R: teamCount - statObject.R.indexOf(team.stats.R),
                RBI: teamCount - statObject.RBI.indexOf(team.stats.RBI),
                SB: teamCount - statObject.SB.indexOf(team.stats.SB),
                OBP: teamCount - statObject.OBP.indexOf(team.stats.OBP),
                OPS: teamCount - statObject.OPS.indexOf(team.stats.OPS),
                SO: teamCount - statObject.SO.indexOf(team.stats.SO),
                SV: teamCount - statObject.SV.indexOf(team.stats.SV),
                HD: teamCount - statObject.HD.indexOf(team.stats.HD),
                ERA: teamCount - statObject.ERA.indexOf(team.stats.ERA),
                WHP: teamCount - statObject.WHP.indexOf(team.stats.WHP),
                QS: teamCount - statObject.QS.indexOf(team.stats.QS),
            },
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
            divisionValues: {
                HR: getPointValue('HR'),
                R: getPointValue('R'),
                RBI: getPointValue('RBI'),
                SB: getPointValue('SB'),
                OBP: getPointValue('OBP'),
                OPS: getPointValue('OPS'),
                SO: getPointValue('SO'),
                SV: getPointValue('SV'),
                HD: getPointValue('HD'),
                ERA: getPointValue('ERA'),
                WHP: getPointValue('WHP'),
                QS: getPointValue('QS')
            },
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
        .slice(0, 6);
    let d4Bums = promotionStuff
        .filter(y => y.division === 4)
        .filter(notPromoted)
        .sort((a, b) => (a.divisionRank > b.divisionRank) ? 1 : -1)
        .slice(0, 14);

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
