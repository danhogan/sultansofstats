<script lang="ts">
	import champions from '$lib/data/champions.json';

	// Sort newest first
	const sortedChampions = [...champions].sort((a, b) => b.year - a.year);
</script>

<svelte:head>
	<title>History · Sultans of Stats</title>
</svelte:head>

<div class="history-container">
	<h1 class="page-title">Hall of Champions</h1>

	<div class="table-wrapper">
		<table class="champions-table">
			<thead>
				<tr>
					<th class="col-year header-year"></th>
					<th class="col-d1 header-d1">D1 Champion</th>
					<th class="col-year header-year"></th>
					<th class="col-pts header-pts">Points Champion</th>
				</tr>
			</thead>
			<tbody>
				{#each sortedChampions as season}
					<tr class:double-crown={season.doubleCrown}>
						<td class="year">{season.year}</td>
						<td class="champion-cell">
							{#if season.d1Champion}
								<span class="team">{season.d1Champion}</span>
								<span class="meta">
									{season.d1Manager}
									{#if season.d1RotoPoints}
										· {season.d1RotoPoints} pts
									{/if}
									{#if season.doubleCrown}
										<span class="crown" title="Double Crown">👑</span>
									{/if}
								</span>
							{:else}
								<span class="unknown">—</span>
							{/if}
						</td>
						<td class="year">{season.year}</td>
						<td class="champion-cell">
							{#if season.pointsChampion}
								<span class="team">{season.pointsChampion}</span>
								<span class="meta">
									{season.pointsManager}
									{#if season.pointsTotal}
										· {season.pointsTotal.toLocaleString()} pts
									{/if}
									{#if season.doubleCrown}
										<span class="crown" title="Double Crown">👑</span>
									{/if}
								</span>
							{:else}
								<span class="unknown">—</span>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	.history-container {
		max-width: 860px;
		margin: 2em auto;
		padding: 0 1em;
	}

	.page-title {
		font-size: 1.8rem;
		font-weight: 700;
		color: var(--text-primary);
		margin-bottom: 1.5em;
		text-align: center;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.table-wrapper {
		width: 100%;
		overflow-x: auto;
	}

	.champions-table {
		width: 100%;
		border-collapse: collapse;
		table-layout: fixed;
	}

	thead th {
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		padding: 0.75em 1em;
		text-align: left;
	}

	.header-d1 {
		background: var(--color-primary);
		color: white;
		border-radius: 6px 6px 0 0;
	}

	.header-pts {
		background: #a78bfa;
		color: white;
		border-radius: 6px 6px 0 0;
	}

	.header-year {
		background: transparent;
	}

	.col-year { width: 52px; }
	.col-d1, .col-pts { width: auto; }

	tbody tr {
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	tbody tr:last-child {
		border-bottom: none;
	}

	tbody tr:hover {
		background: rgba(255, 255, 255, 0.03);
	}

	tbody tr.double-crown {
		background: rgba(234, 179, 8, 0.06);
	}

	td {
		padding: 0.65em 1em;
		vertical-align: middle;
		background: var(--bg-card);
	}

	td.year {
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--text-secondary);
		opacity: 0.7;
		text-align: right;
		padding-right: 0.75em;
		background: transparent;
	}

	.champion-cell {
		display: flex;
		flex-direction: column;
		gap: 0.15em;
	}

	.team {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.meta {
		font-size: 0.72rem;
		color: var(--text-secondary);
		opacity: 0.65;
	}

	.crown {
		margin-left: 0.2em;
		font-size: 0.85rem;
	}

	.unknown {
		font-size: 0.85rem;
		color: var(--text-secondary);
		opacity: 0.3;
	}

	/* Gap between the two columns */
	td.year:nth-child(3) {
		padding-left: 2em;
	}

	thead th.col-year:nth-child(3) {
		padding-left: 2em;
	}
</style>
