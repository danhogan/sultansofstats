<script lang="ts">
	import jsonData from "$lib/data/allTheData.json";
	import LineChartComponent from "$lib/components/LineChart.svelte";

	let selectedLeague = $state<string>("fmsw2r2blci8ghpy");
	let selectedStat = $state<string>("HR");

	const leagues = [
		{ value: "e3px47n0lr7xx2y9", label: "D1 - The Sultans of Stats" },
		{ value: "88ggwnu4lr7xxkg8", label: "D2 - Flea Clifton" },
		{ value: "7vlt8wtklr7xxtne", label: "D2 - Alex Flicker" },
		{ value: "77en7xmelr7xy3n1", label: "D2 - Mortiz Seider" },
		{ value: "y6zp4bfslr7xyfbe", label: "D3 - Ron Santo" },
		{ value: "kpc4liy3lr7xyner", label: "D3 - Sammy Sosa" },
		{ value: "wm8ixb3flr7y4vh5", label: "D3 - Greg Maddux" },
		{ value: "838h7q3plr7xz1nt", label: "D3 - Moises Alou" },
		{ value: "24f5ki4tlr7xza1j", label: "D3 - Kyle Hendricks" },
		{ value: "ou1xzkfplr7xzie8", label: "D3 - Bryzzo Souvenir" },
		{ value: "ls0uwwrqlr7xyuss", label: "D3 - Steve Bartman" },
		{ value: "3y3ol2vzlr7xzq5s", label: "D4 - Pete Alonso" },
		{ value: "yr8kla9jlr7y38vm", label: "D4 - Jonathan India" },
		{ value: "mb8xviqylr7y2zvv", label: "D4 - A.J" },
		{ value: "d9idp3pzlr7y2p5d", label: "D4 - Brady Singer" },
		{ value: "qnyleexplr7y2dze", label: "D4 - Harrison Bader" },
		{ value: "di1qgcmtlr7y2489", label: "D4 - Wyatt Langford" },
		{ value: "scq69b6xlr7y1suk", label: "D4 - Hurston Waldrep" },
		{ value: "f168202alr7y1egz", label: "D4 - Mike Zunino" },
		{ value: "b3xezupjlr7y17rx", label: "D4 - Anthony DeSclafani" },
		{ value: "kydzgf8clr7y0zue", label: "D4 - Dane Dunning" },
		{ value: "2xpo8hpflr7y0om1", label: "D4 - Kirby Snead" },
	];

	const stats = [
		{ value: "R", label: "Runs" },
		{ value: "HR", label: "Home Runs" },
		{ value: "RBI", label: "RBI" },
		{ value: "SB", label: "Steals" },
		{ value: "OBP", label: "OBP" },
		{ value: "SLG", label: "SLG" },
		{ value: "QS", label: "W+QS" },
		{ value: "SO", label: "Strikeouts" },
		{ value: "K9", label: "K/9" },
		{ value: "SV", label: "SV+HLD" },
		{ value: "ERA", label: "ERA" },
		{ value: "WHP", label: "WHIP" },
	];

	const formattedData = $derived(
		jsonData.theData
			.filter((z: any) => z.leagueId == selectedLeague)
			.map((x: any) => ({
				name: x.teamName,
				data: x.statsHistory[selectedStat],
			})),
	);
</script>

<div class="container" style="margin-top: 1.5em;">
	<div class="selects">
		<div class="select-group">
			<label for="league-select">League</label>
			<select id="league-select" bind:value={selectedLeague}>
				{#each leagues as league}
					<option value={league.value}>{league.label}</option>
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
