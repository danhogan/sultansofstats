<script lang="ts">
	import jsonData from "$lib/data/allTheData.json";
	import LeaderboardComponent from "$lib/components/Leaderboard.svelte";
	import Toggle from "$lib/components/Toggle.svelte";

	let allData = $state<any[]>(jsonData.theData);
	let statValueLocation = $state("statValues");

	function formattedDate(): string {
		const theDate = new Date(jsonData.updateDate);
		return `${theDate.toLocaleDateString()} @ ${theDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
	}

	function handleFilter(division: number) {
		if (division === 0) {
			allData = jsonData.theData;
			statValueLocation = "statValues";
		} else {
			allData = jsonData.theData.filter(
				(x: any) => x.division === division,
			);
			statValueLocation = "divisionValues";
		}
	}
</script>

<svelte:head>
	<title>Leaderboard · Sultans of Stats</title>
</svelte:head>

<div class="board-container">
	<div class="controls">
		<div class="controls-left">
			<Toggle onfilter={handleFilter} />
			<div class="promo-legend">
				<span><span class="arr">↑↑</span> Double promotion</span>
				<span class="sep">·</span>
				<span><span class="arr">↑</span> Promotion</span>
				<span class="sep">·</span>
				<span><span class="arr">↓</span> Relegation</span>
			</div>
		</div>
		<span class="updated">Last Updated: {formattedDate()}</span>
	</div>

	<LeaderboardComponent data={allData} {statValueLocation} />
</div>

<style>
	.controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.75em;
		flex-wrap: wrap;
		gap: 0.5em;
	}

	.controls-left {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.updated {
		color: var(--text-secondary);
		font-size: 0.8rem;
	}

	.promo-legend {
		display: flex;
		align-items: baseline;
		gap: 0.4em;
		font-size: 0.72rem;
		color: var(--text-secondary);
		opacity: 0.65;
		flex-wrap: wrap;
	}

	.sep {
		opacity: 0.35;
	}

	.arr {
		vertical-align: 0.2em;
	}
</style>
