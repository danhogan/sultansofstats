<script lang="ts">
	import jsonData from '$lib/data/allTheData.json';
	import LeaderboardComponent from '$lib/components/Leaderboard.svelte';
	import Toggle from '$lib/components/Toggle.svelte';

	let allData = $state<any[]>(jsonData.theData);
	let statValueLocation = $state('statValues');

	function formattedDate(): string {
		const theDate = new Date(jsonData.updateDate);
		return `${theDate.toLocaleDateString()} @ ${theDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
	}

	function handleFilter(division: number) {
		if (division === 0) {
			allData = jsonData.theData;
			statValueLocation = 'statValues';
		} else {
			allData = jsonData.theData.filter((x: any) => x.division === division);
			statValueLocation = 'divisionValues';
		}
	}
</script>

<div class="board-container">
	<div class="controls">
		<Toggle onfilter={handleFilter} />
		<span class="updated">Last Updated: {formattedDate()}</span>
	</div>
	<LeaderboardComponent data={allData} {statValueLocation} />
</div>

<style>
	.controls {
		display: flex;
		justify-content: space-around;
		align-items: center;
		margin-bottom: 1em;
		flex-wrap: wrap;
		gap: 0.5em;
	}

	.updated {
		color: var(--text-secondary);
		font-size: 0.875rem;
	}
</style>
