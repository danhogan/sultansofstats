<script lang="ts">
	import type { Data, Order, HeadCell } from '$lib/types';

	let { data, statValueLocation }: { data: any[]; statValueLocation: string } = $props();

	let order = $state<Order>('asc');
	let orderBy = $state<keyof Data>('overallRank');
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
			OPS: row.stats.OPS,
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
			OPSRank: row.statValues.OPS,
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
			divisionOPSRank: row.divisionValues.OPS,
			divisionWQSRank: row.divisionValues.WQS,
			divisionKRank: row.divisionValues.K,
			divisionK9Rank: row.divisionValues.K9,
			divisionSVHLDRank: row.divisionValues.SVHLD,
			divisionERARank: row.divisionValues.ERA,
			divisionWHPRank: row.divisionValues.WHP
		}))
	);

	const overallBool = $derived(statValueLocation === 'statValues');

	const headCells = $derived<HeadCell[]>([
		{ id: 'teamName', numeric: false, label: 'Team Name' },
		{ id: 'leagueName', numeric: false, label: 'League' },
		{ id: 'leagueRank', numeric: true, label: 'League Rank' },
		{
			id: overallBool ? 'overallRank' : 'divisionRank',
			numeric: true,
			label: overallBool ? 'Overall Rank' : 'Division Rank'
		},
		{
			id: overallBool ? 'totalPoints' : 'divisionPoints',
			numeric: true,
			label: overallBool ? 'Total Points' : 'Division Points'
		},
		{ id: 'R', numeric: true, label: 'R' },
		{ id: 'HR', numeric: true, label: 'HR' },
		{ id: 'RBI', numeric: true, label: 'RBI' },
		{ id: 'SB', numeric: true, label: 'SB' },
		{ id: 'OBP', numeric: true, label: 'OBP' },
		{ id: 'OPS', numeric: true, label: 'OPS' },
		{ id: 'WQS', numeric: true, label: 'W+QS' },
		{ id: 'K', numeric: true, label: 'K' },
		{ id: 'K9', numeric: true, label: 'K/9' },
		{ id: 'SVHLD', numeric: true, label: 'SV+HLD' },
		{ id: 'ERA', numeric: true, label: 'ERA' },
		{ id: 'WHP', numeric: true, label: 'WHP' }
	]);

	const sortedRows = $derived(rows.slice().sort(getComparator(order, orderBy)));

	function descendingComparator<T>(a: T, b: T, key: keyof T) {
		if (b[key] < a[key]) return -1;
		if (b[key] > a[key]) return 1;
		return 0;
	}

	function getComparator(o: Order, key: keyof Data) {
		return o === 'desc'
			? (a: any, b: any) => descendingComparator(a, b, key)
			: (a: any, b: any) => -descendingComparator(a, b, key);
	}

	function handleSort(property: keyof Data) {
		const rankLike = ['overallRank', 'leagueRank', 'leagueName', 'teamName', 'divisionRank'];
		if (rankLike.includes(property as string)) {
			const isAsc = orderBy === property && order === 'asc';
			order = isAsc ? 'desc' : 'asc';
		} else {
			const isDesc = orderBy === property && order === 'desc';
			order = isDesc ? 'asc' : 'desc';
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

	function isSelected(name: string) {
		return selected.includes(name);
	}

	function getColor(rank: number): string {
		const count = rows.length;
		if (rank / count < 0.1) return 'heat-1';
		if (rank / count < 0.25) return 'heat-2';
		if (rank / count < 0.4) return 'heat-3';
		if (rank / count < 0.55) return 'heat-4';
		if (rank / count < 0.7) return 'heat-5';
		if (rank / count < 0.85) return 'heat-6';
		return 'heat-7';
	}

	function getPromoColor(promoCode: string): string {
		if (promoCode === 'super') return '#2196f3'; // blue[500]
		if (promoCode === 'promotion') return '#4caf50'; // green[500]
		if (promoCode === 'relegation') return '#f44336'; // red[500]
		return '#f9a825'; // yellow[700]
	}

	function getPromoText(promo: string): string {
		switch (promo) {
			case 'super': return 'Set for double promotion';
			case 'promotion': return 'Set for promotion';
			case 'relegation': return 'Set for relegation';
			default: return 'Set to stay put';
		}
	}

	function sortIndicator(cell: HeadCell): string {
		if (orderBy !== cell.id) return '';
		return order === 'asc' ? ' ▲' : ' ▼';
	}
</script>

<div class="table-wrapper">
	<table>
		<thead>
			<tr>
				{#each headCells as cell}
					<th class:numeric={cell.numeric} class:active={orderBy === cell.id}>
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
					<!-- Team name + promo indicator -->
					<td>
						<span
							class="promo-dot"
							title={getPromoText(row.promotion)}
							style="color: {getPromoColor(row.promotion)}"
						>●</span>
						<a
							target="_blank"
							href={`https://www.fantrax.com/fantasy/league/${row.leagueId}/team/roster;teamId=${row.teamId}`}
						>
							{row.teamName}
						</a>
					</td>
					<!-- League -->
					<td class="right">
						<a
							target="_blank"
							href={`https://www.fantrax.com/fantasy/league/${row.leagueId}/standings`}
						>
							{row.leagueName}
						</a>
					</td>
					<!-- Ranks & Points -->
					<td class="right">{row.leagueRank}</td>
					<td class="right">{overallBool ? row.overallRank : row.divisionRank}</td>
					<td class="right">{overallBool ? row.totalPoints : row.divisionPoints}</td>
					<!-- Stat chips -->
					<td class="right">
						<span class="chip {getColor(overallBool ? row.RRank : row.divisionRRank)}">
							{row.R} ({overallBool ? row.RRank : row.divisionRRank})
						</span>
					</td>
					<td class="right">
						<span class="chip {getColor(overallBool ? row.HRRank : row.divisionHRRank)}">
							{row.HR} ({overallBool ? row.HRRank : row.divisionHRRank})
						</span>
					</td>
					<td class="right">
						<span class="chip {getColor(overallBool ? row.RBIRank : row.divisionRBIRank)}">
							{row.RBI} ({overallBool ? row.RBIRank : row.divisionRBIRank})
						</span>
					</td>
					<td class="right">
						<span class="chip {getColor(overallBool ? row.SBRank : row.divisionSBRank)}">
							{row.SB} ({overallBool ? row.SBRank : row.divisionSBRank})
						</span>
					</td>
					<td class="right">
						<span class="chip {getColor(overallBool ? row.OBPRank : row.divisionOBPRank)}">
							{row.OBP.toFixed(3)} ({overallBool ? row.OBPRank : row.divisionOBPRank})
						</span>
					</td>
					<td class="right">
						<span class="chip {getColor(overallBool ? row.OPSRank : row.divisionOPSRank)}">
							{row.OPS.toFixed(3)} ({overallBool ? row.OPSRank : row.divisionOPSRank})
						</span>
					</td>
					<td class="right">
						<span class="chip {getColor(overallBool ? row.WQSRank : row.divisionWQSRank)}">
							{row.WQS} ({overallBool ? row.WQSRank : row.divisionWQSRank})
						</span>
					</td>
					<td class="right">
						<span class="chip {getColor(overallBool ? row.KRank : row.divisionKRank)}">
							{row.K} ({overallBool ? row.KRank : row.divisionKRank})
						</span>
					</td>
					<td class="right">
						<span class="chip {getColor(overallBool ? row.K9Rank : row.divisionK9Rank)}">
							{row.K9.toFixed(2)} ({overallBool ? row.K9Rank : row.divisionK9Rank})
						</span>
					</td>
					<td class="right">
						<span class="chip {getColor(overallBool ? row.SVHLDRank : row.divisionSVHLDRank)}">
							{row.SVHLD} ({overallBool ? row.SVHLDRank : row.divisionSVHLDRank})
						</span>
					</td>
					<td class="right">
						<span class="chip {getColor(overallBool ? row.ERARank : row.divisionERARank)}">
							{row.ERA.toFixed(2)} ({overallBool ? row.ERARank : row.divisionERARank})
						</span>
					</td>
					<td class="right">
						<span class="chip {getColor(overallBool ? row.WHPRank : row.divisionWHPRank)}">
							{row.WHP.toFixed(3)} ({overallBool ? row.WHPRank : row.divisionWHPRank})
						</span>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.table-wrapper {
		width: 100%;
		overflow-x: auto;
	}

	table {
		width: 100%;
		min-width: 750px;
		border-collapse: collapse;
		font-size: 0.8rem;
	}

	thead {
		position: sticky;
		top: 56px; /* height of header */
		z-index: 10;
		background-color: var(--bg-paper);
	}

	th {
		padding: 0;
		border-bottom: 2px solid rgba(255, 255, 255, 0.15);
		white-space: nowrap;
	}

	th button {
		background: none;
		border: none;
		color: var(--text-secondary);
		cursor: pointer;
		font-size: 0.75rem;
		font-weight: 600;
		padding: 8px 6px;
		text-align: left;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		width: 100%;
	}

	th.numeric button {
		text-align: right;
	}

	th.active button {
		color: var(--text-primary);
	}

	td {
		padding: 4px 6px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.07);
		vertical-align: middle;
	}

	td.right {
		text-align: right;
	}

	tr {
		cursor: pointer;
	}

	tr:hover {
		background-color: rgba(255, 255, 255, 0.05);
	}

	tr.row-selected {
		background-color: rgba(237, 75, 37, 0.2);
	}

	.promo-dot {
		font-size: 1.1em;
		margin-right: 0.3em;
		vertical-align: middle;
		cursor: default;
	}

	/* Tooltip via title attribute — browser native */
</style>
