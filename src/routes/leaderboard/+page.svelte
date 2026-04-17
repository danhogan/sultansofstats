<script lang="ts">
	// 2022 and 2023 use a different scoring system (separate SV/HD, no K9)
	// and will cause the leaderboard to crash. Needs separate handling before re-enabling.
	//	import jsonData2022 from "$lib/data/allTheData-2022.json";
	//	import jsonData2023 from "$lib/data/allTheData-2023.json";
	import jsonData2024 from "$lib/data/allTheData-2024.json";
	import jsonData2025 from "$lib/data/allTheData-2025.json";
	import jsonDataCurrent from "$lib/data/allTheData.json";
	import LeaderboardComponent from "$lib/components/Leaderboard.svelte";
	import Toggle from "$lib/components/Toggle.svelte";

	const yearMap: Record<string, any> = {
		"2026": jsonDataCurrent,
		"2025": jsonData2025,
		"2024": jsonData2024,
		//		"2023": jsonData2023,
		//		"2022": jsonData2022,
	};

	let selectedYear = $state("2026");
	let activeJson = $derived(yearMap[selectedYear]);
	let allData = $state<any[]>(jsonDataCurrent.theData);
	let statValueLocation = $state("statValues");
	let selectedDivision = $state(0);
	let slgStat = $derived(selectedYear === "2026" ? "SLG" : "OPS"); //trying to get slg to switch to ops when selecting a different year to display on the leaderboard

	$effect(() => {
		selectedDivision = 0;
		allData = activeJson.theData;
		statValueLocation = "statValues";
	});

	function formattedDate(): string {
		const theDate = new Date(activeJson.updateDate);
		return `${theDate.toLocaleDateString()} @ ${theDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
	}

	function handleFilter(division: number) {
		selectedDivision = division;

		if (division === 0) {
			allData = activeJson.theData;
			statValueLocation = "statValues";
		} else {
			allData = activeJson.theData.filter(
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
			<span class="year-select-wrap">
				<select bind:value={selectedYear} class="year-select">
					{#each Object.keys(yearMap).reverse() as year}
						<option value={year}>{year}</option>
					{/each}
				</select>
			</span>
			<Toggle selected={selectedDivision} onfilter={handleFilter} />
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
	<LeaderboardComponent data={allData} {statValueLocation} {slgStat} />
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
		font-size: 0.72rem;
		opacity: 0.65;
		margin-left: auto;
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

	.year-select-wrap {
		position: relative;
		display: inline-flex;
	}

	.year-select-wrap::after {
		content: "▾";
		position: absolute;
		right: 11px;
		top: 50%;
		transform: translateY(-52%);
		color: var(--text-secondary);
		font-size: 0.7rem;
		pointer-events: none;
	}

	.year-select {
		appearance: none;
		background: var(--bg-paper);
		color: var(--text-secondary);
		border: 1.5px solid
			color-mix(in srgb, var(--color-primary) 38%, transparent);
		border-radius: 999px;
		min-width: 80px;
		padding: 5px 30px 5px 14px;
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		cursor: pointer;
	}

	.year-select:hover {
		background: color-mix(in srgb, var(--color-primary) 10%, transparent);
		border-color: color-mix(in srgb, var(--color-primary) 65%, transparent);
		color: #fff;
	}

	.year-select option {
		background: var(--bg-paper);
		color: var(--text-primary);
		border: none;
		padding: 4px 8px;
		font-size: 0.85rem;
		cursor: pointer;
	}

	.year-select:focus {
		outline: none;
		background: var(--bg-paper);
		border-color: color-mix(in srgb, var(--color-primary) 50%, transparent);
	}
</style>
