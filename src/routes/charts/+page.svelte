<script lang="ts">
	// IAmABulldozer: Refactored leagues to import from $lib/leagues.ts instead
	// of hardcoding league IDs and names. Fixed stat keys to match actual data
	// (OPS->SLG, QS->WQS, SO->K, SV->SVHLD). Fixed default selectedLeague to
	// use leagues[0].id so it auto-updates when leagues.ts is updated each season.
	import jsonData from '$lib/data/allTheData.json';
	import LineChartComponent from '$lib/components/LineChart.svelte';
	import { leagues } from '$lib/leagues';

	let selectedLeague = $state<string>(leagues[0].id);
	let selectedStat = $state<string>('HR');


	const stats = [
		{ value: 'R', label: 'Runs' },
		{ value: 'HR', label: 'Home Runs' },
		{ value: 'RBI', label: 'RBI' },
		{ value: 'SB', label: 'Steals' },
		{ value: 'OBP', label: 'OBP' },
		{ value: 'SLG', label: 'SLG' },
		{ value: 'WQS', label: 'W+QS' },
		{ value: 'K', label: 'Strikeouts' },
		{ value: 'K9', label: 'K/9' },
		{ value: 'SVHD', label: 'SV+HLD' },
		{ value: 'ERA', label: 'ERA' },
		{ value: 'WHP', label: 'WHIP' }
	];

	const formattedData = $derived(
    jsonData.theData
        .filter((z: any) => z.leagueId == selectedLeague)
        .map((x: any) => ({
            name: x.teamName,
            data: (x.statsHistory[selectedStat] || []).map((entry: any) => entry.value)
        }))
);
</script>

<div class="container" style="margin-top: 1.5em;">
	<div class="selects">
		<div class="select-group">
			<label for="league-select">League</label>
			<select id="league-select" bind:value={selectedLeague}>
				{#each leagues as league}
					<option value={league.id}>{league.label}</option>
				{/each}
			</select>
		</div>

		<div class="select-group">
			<label for="stat-select">Stat</label>
			<select id="stat-select" bind:value={selectedStat}>
				{#each stats as stat}
					<option value={stat.value}>{stat.label}</option>
				{/each}
			</select>
		</div>
	</div>

	<LineChartComponent data={formattedData} {selectedStat} />
</div>

<style>
	.selects {
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
		gap: 1em;
		margin-bottom: 1.5em;
	}

	.select-group {
		display: flex;
		flex-direction: column;
		gap: 0.25em;
		min-width: 280px;
	}

	label {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-secondary);
	}

	select {
		background-color: var(--bg-paper);
		color: var(--text-primary);
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 4px;
		padding: 10px 12px;
		font-size: 1rem;
		cursor: pointer;
	}

	select:focus {
		outline: 2px solid var(--color-secondary);
		outline-offset: 1px;
	}
</style>
