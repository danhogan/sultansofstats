<script lang="ts">
	import type { Data, Order, HeadCell } from "$lib/types";

	let {
		data,
		statValueLocation,
		slgStat = "OPS",
	}: { data: any[]; statValueLocation: string; slgStat: string } = $props();
	
	let order = $state<Order>("asc");
	let orderBy = $state<keyof Data>("overallRank");
	let selected = $state<string[]>([]);
	
	// Flatten nested stats onto each row
	const rows = $derived(
		data.map((row: any) => ({
			...row,
			R: row.stats.R,
			HR: row.stats.HR,
			RBI: row.stats.RBI,
			SB: row.stats.SB,
			OBP: row.stats.OBP,
			OPS: row.stats[slgStat ?? "SLG"], //attempting to get SLG to swap to OPS where applicable
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
			OPSRank: row.statValues[slgStat ?? "SLG"], //attempting to get SLG to swap to OPS where applicable
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
			divisionOPSRank: row.divisionValues[slgStat ?? "SLG"],  //attempting to get SLG to swap to OPS where applicable
			divisionWQSRank: row.divisionValues.WQS,
			divisionKRank: row.divisionValues.K,
			divisionK9Rank: row.divisionValues.K9,
			divisionSVHLDRank: row.divisionValues.SVHLD,
			divisionERARank: row.divisionValues.ERA,
			divisionWHPRank: row.divisionValues.WHP,
		}))
	);

	const overallBool = $derived(statValueLocation === "statValues");

	// Reset sort to the appropriate rank column whenever the view switches
	$effect(() => {
		orderBy = statValueLocation === "statValues" ? "overallRank" : "divisionRank";
		order = "asc";
	});

	// "2025 D2 - John Libka" → "John Libka"
	function formatLeagueName(name: string): string {
		return name.replace(/^\d{4} D\d+ - /, "");
	}

	const headCells = $derived<HeadCell[]>([
		{ id: "teamName",   numeric: false, label: "Team"  },
		{ id: "leagueName", numeric: false, label: "League"},
		{ id: "leagueRank", numeric: true,  label: "Lg"   },
		{ id: overallBool ? "overallRank"   : "divisionRank",   numeric: true, label: "Rank" },
		{ id: overallBool ? "totalPoints"   : "divisionPoints", numeric: true, label: "Pts"  },
		{ id: "R",     numeric: true, label: "R",    center: true },
		{ id: "HR",    numeric: true, label: "HR",   center: true },
		{ id: "RBI",   numeric: true, label: "RBI",  center: true },
		{ id: "SB",    numeric: true, label: "SB",   center: true },
		{ id: "OBP",   numeric: true, label: "OBP",  center: true },
		{ id: "OPS",   numeric: true, label: slgStat, center: true },
		{ id: "WQS",   numeric: true, label: "W+QS", center: true },
		{ id: "K",     numeric: true, label: "K",    center: true },
		{ id: "K9",    numeric: true, label: "K/9",  center: true },
		{ id: "SVHLD", numeric: true, label: "SVH",  center: true },
		{ id: "ERA",   numeric: true, label: "ERA",  center: true },
		{ id: "WHP",   numeric: true, label: "WHIP", center: true },
	]);

	const sortedRows = $derived(rows.slice().sort(getComparator(order, orderBy)));

	function descendingComparator<T>(a: T, b: T, key: keyof T) {
		if (b[key] < a[key]) return -1;
		if (b[key] > a[key]) return 1;
		return 0;
	}

	function getComparator(o: Order, key: keyof Data) {
		return o === "desc"
			? (a: any, b: any) => descendingComparator(a, b, key)
			: (a: any, b: any) => -descendingComparator(a, b, key);
	}

	function handleSort(property: keyof Data) {
		const rankLike = ["overallRank", "leagueRank", "leagueName", "teamName", "divisionRank"];
		if (rankLike.includes(property as string)) {
			const isAsc = orderBy === property && order === "asc";
			order = isAsc ? "desc" : "asc";
		} else {
			const isDesc = orderBy === property && order === "desc";
			order = isDesc ? "asc" : "desc";
		}
		orderBy = property;
	}

	function handleClick(teamName: string) {
		const idx = selected.indexOf(teamName);
		if (idx === -1) {
			selected = [...selected, teamName];
		} else {
			selected = selected.filter((_, i) => i !== idx);
		}
	}

	function isSelected(name: string) { return selected.includes(name); }

	function getColor(rank: number): string {
		const count = rows.length;
		if (rank / count < 0.1)  return "heat-1";
		if (rank / count < 0.25) return "heat-2";
		if (rank / count < 0.4)  return "heat-3";
		if (rank / count < 0.55) return "heat-4";
		if (rank / count < 0.7)  return "heat-5";
		if (rank / count < 0.85) return "heat-6";
		return "heat-7";
	}

	function getPromoIndicator(promo: string): string {
		switch (promo) {
			case "super":      return "↑↑";
			case "promotion":  return "↑";
			case "relegation": return "↓";
			default:           return "";
		}
	}

	function getPromoTitle(promo: string): string {
		switch (promo) {
			case "super":      return "Double promotion";
			case "promotion":  return "Promotion";
			case "relegation": return "Relegation";
			default:           return "";
		}
	}

	function getDivisionColor(division: number): string {
		switch (division) {
			case 1: return "#eab308";
			case 2: return "#a78bfa";
			case 3: return "#38bdf8";
			default: return "#9ca3af";
		}
	}

	function sortIndicator(cell: HeadCell): string {
		if (orderBy !== cell.id) return "";
		return order === "asc" ? " ↑" : " ↓";
	}
</script>

<div class="table-wrapper">
	<table>
		<thead>
			<tr>
				{#each headCells as cell}
					<th class:center={cell.center} class:numeric={cell.numeric && !cell.center} class:active={orderBy === cell.id}>
						<button onclick={() => handleSort(cell.id)}>
							{cell.label}{sortIndicator(cell)}
						</button>
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each sortedRows as row (row.teamName + row.leagueName)}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<tr
					onclick={() => handleClick(row.teamName)}
					class:row-selected={isSelected(row.teamName)}
				>
					<td style="border-left: 3px solid {getDivisionColor(row.division)}">
						<a
							class="team-link"
							target="_blank"
							href={`https://www.fantrax.com/fantasy/league/${row.leagueId}/team/roster;teamId=${row.teamId}`}
							title={row.teamName}
							style="color: {getDivisionColor(row.division)}"
						>{row.teamName}</a>{#if getPromoIndicator(row.promotion)}<span class="promo-indicator" title={getPromoTitle(row.promotion)}>{getPromoIndicator(row.promotion)}</span>{/if}
					</td>
					<td>
						<a
							class="league-link"
							target="_blank"
							href={`https://www.fantrax.com/fantasy/league/${row.leagueId}/standings`}
							title={row.leagueName}
							style="color: {getDivisionColor(row.division)}"
						>{formatLeagueName(row.leagueName)}</a>
					</td>
					<td class="right">{row.leagueRank}</td>
					<td class="right">{overallBool ? row.overallRank : row.divisionRank}</td>
					<td class="right">{overallBool ? row.totalPoints : row.divisionPoints}</td>

					<td class="stat-cell"><span class="chip chip-sm {getColor(overallBool ? row.RRank    : row.divisionRRank)}">{overallBool ? row.RRank    : row.divisionRRank}</span><span class="stat-val">{row.R}</span></td>
					<td class="stat-cell"><span class="chip chip-sm {getColor(overallBool ? row.HRRank   : row.divisionHRRank)}">{overallBool ? row.HRRank   : row.divisionHRRank}</span><span class="stat-val">{row.HR}</span></td>
					<td class="stat-cell"><span class="chip chip-sm {getColor(overallBool ? row.RBIRank  : row.divisionRBIRank)}">{overallBool ? row.RBIRank  : row.divisionRBIRank}</span><span class="stat-val">{row.RBI}</span></td>
					<td class="stat-cell"><span class="chip chip-sm {getColor(overallBool ? row.SBRank   : row.divisionSBRank)}">{overallBool ? row.SBRank   : row.divisionSBRank}</span><span class="stat-val">{row.SB}</span></td>
					<td class="stat-cell"><span class="chip chip-sm {getColor(overallBool ? row.OBPRank  : row.divisionOBPRank)}">{overallBool ? row.OBPRank  : row.divisionOBPRank}</span><span class="stat-val">{(row.OBP ?? 0).toFixed(3)}</span></td>
					<td class="stat-cell"><span class="chip chip-sm {getColor(overallBool ? row.OPSRank  : row.divisionOPSRank)}">{overallBool ? row.OPSRank  : row.divisionOPSRank}</span><span class="stat-val">{(row.OPS ?? 0).toFixed(3)}</span></td>
					<td class="stat-cell"><span class="chip chip-sm {getColor(overallBool ? row.WQSRank  : row.divisionWQSRank)}">{overallBool ? row.WQSRank  : row.divisionWQSRank}</span><span class="stat-val">{row.WQS}</span></td>
					<td class="stat-cell"><span class="chip chip-sm {getColor(overallBool ? row.KRank    : row.divisionKRank)}">{overallBool ? row.KRank    : row.divisionKRank}</span><span class="stat-val">{row.K}</span></td>
					<td class="stat-cell"><span class="chip chip-sm {getColor(overallBool ? row.K9Rank   : row.divisionK9Rank)}">{overallBool ? row.K9Rank   : row.divisionK9Rank}</span><span class="stat-val">{(row.K9 ?? 0).toFixed(2)}</span></td>
					<td class="stat-cell"><span class="chip chip-sm {getColor(overallBool ? row.SVHLDRank: row.divisionSVHLDRank)}">{overallBool ? row.SVHLDRank: row.divisionSVHLDRank}</span><span class="stat-val">{row.SVHLD}</span></td>
					<td class="stat-cell"><span class="chip chip-sm {getColor(overallBool ? row.ERARank  : row.divisionERARank)}">{overallBool ? row.ERARank  : row.divisionERARank}</span><span class="stat-val">{(row.ERA ?? 0).toFixed(2)}</span></td>
					<td class="stat-cell"><span class="chip chip-sm {getColor(overallBool ? row.WHPRank  : row.divisionWHPRank)}">{overallBool ? row.WHPRank  : row.divisionWHPRank}</span><span class="stat-val">{(row.WHP ?? 0).toFixed(3)}</span></td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	/* ── Mobile: horizontal scroll, no sticky thead ─────────────── */
	.table-wrapper {
		width: 100%;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
	}

	table {
		border-collapse: collapse;
		font-size: 0.9rem;
		table-layout: fixed;
		/* ensure the table is wide enough to scroll on small screens */
		min-width: 900px;
		width: 100%;
	}

	/* Narrow fixed widths for the info columns so stat chips get more room */
	th:nth-child(1) { width: 112px; }  /* Team   */
	th:nth-child(2) { width: 90px;  }  /* League */
	th:nth-child(3) { width: 36px;  }  /* Lg     */
	th:nth-child(4) { width: 50px;  }  /* Rank   */
	th:nth-child(5) { width: 44px;  }  /* Pts    */
	/* Remaining 12 stat columns share the rest equally */

	th {
		padding: 0;
		border-bottom: 1px solid rgba(255, 255, 255, 0.12);
		overflow: hidden;
	}

	th button {
		background: none;
		border: none;
		color: var(--text-secondary);
		cursor: pointer;
		font-size: 0.72rem;
		font-weight: 700;
		padding: 8px 5px;
		text-align: left;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		transition: color 0.15s;
	}

	/* Right-align rank/pts style headers */
	th.numeric button { text-align: right; }

	/* Center-align stat column headers to match data cells */
	th.center button { text-align: center; }

	th.active button { color: var(--color-primary); }

	td {
		padding: 5px 5px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
		vertical-align: middle;
		overflow: hidden;
		white-space: nowrap;
	}

	td.right { text-align: right; }

	/* Stat cells: chip + raw value stacked, centered */
	td.stat-cell {
		text-align: center;
		padding: 3px 3px;
	}

	tr { cursor: pointer; }

	tr:hover { background-color: rgba(255, 255, 255, 0.04); }

	tr.row-selected { background-color: rgba(237, 75, 37, 0.15); }

	.team-link {
		display: inline-block;
		max-width: 92px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		vertical-align: middle;
		font-size: 0.78rem;
		text-decoration: none;
	}

	.team-link:hover {
		text-decoration: underline;
	}

	.league-link {
		display: inline-block;
		max-width: 80px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		vertical-align: middle;
		text-decoration: none;
		font-size: 0.78rem;
	}

	.league-link:hover {
		text-decoration: underline;
	}

	.promo-indicator {
		font-size: 0.65rem;
		font-weight: 700;
		color: var(--text-secondary);
		opacity: 0.55;
		margin-left: 0.3em;
		vertical-align: middle;
		cursor: default;
		letter-spacing: -0.02em;
	}

	/* Compact chip — rank number, stacked by default */
	.chip-sm {
		padding: 1px 6px;
		font-size: 0.78rem;
		min-width: 28px;
		text-align: center;
		display: block;
		margin: 0 auto;
	}

	/* Raw stat value */
	.stat-val {
		display: block;
		font-size: 0.68rem;
		color: var(--text-secondary);
		text-align: center;
		margin-top: 2px;
		line-height: 1;
	}

	/* ── Desktop (1080p+): sticky thead, side-by-side chip+value ─ */
	@media (min-width: 1200px) {
		.table-wrapper {
			overflow: visible;
		}

		thead {
			position: sticky;
			top: 44px;
			z-index: 10;
			background-color: var(--bg-dark);
		}

		.chip-sm {
			display: inline-block;
			margin: 0;
		}

		.stat-val {
			display: inline;
			margin-top: 0;
			margin-left: 3px;
			vertical-align: middle;
		}
	}
</style>
