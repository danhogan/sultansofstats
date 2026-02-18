export interface Data {
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

export type Order = 'asc' | 'desc';

export interface HeadCell {
	id: keyof Data;
	label: string;
	numeric: boolean;
}
