<script lang="ts">
	import champions from '$lib/data/champions.json';

	const sortedChampions = [...champions].sort((a, b) => b.year - a.year);
</script>

<svelte:head>
	<title>History · Sultans of Stats</title>
</svelte:head>

<div class="history-page">
	<section class="history-hero" aria-labelledby="history-title">
		<h1 id="history-title" class="sos-gradient">Hall of Champions</h1>
	</section>

	<section class="table-card" aria-label="Champion history">
		<table class="champions-table">
			<thead>
				<tr>
					<th class="col-year">Season</th>
					<th class="col-champion header-d1">
						<span class="header-inner">
							<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="header-icon">
								<path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V17H9v2h6v-2h-2v-2.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 11.63 21 9.55 21 7V6c0-1.1-.9-2-2-2zM7 10.82C5.84 10.4 5 9.3 5 8V7h2v3.82zM12 14c-1.65 0-3-1.35-3-3V5h6v6c0 1.65-1.35 3-3 3zm7-6c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
							</svg>
							D1 Champion
						</span>
					</th>
					<th class="col-champion header-pts">
						<span class="header-inner">
							<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="header-icon">
								<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
							</svg>
							Points Champion
						</span>
					</th>
				</tr>
			</thead>
			<tbody>
				{#each sortedChampions as season}
					<tr class:double-crown={season.doubleCrown}>
						<td class="year">
							<span>{season.year}</span>
							{#if season.doubleCrown}
								<span class="year-badge">Double Crown</span>
							{/if}
						</td>
						<td class="champion-cell d1-cell">
							{#if season.d1Champion}
								<span class="mobile-label">D1 Champion</span>
								<span class="team-row">
									<span class="team">{season.d1Champion}</span>
									{#if season.d1RotoPoints}
										<span class="score-pill">{season.d1RotoPoints} pts</span>
									{/if}
								</span>
								<span class="meta">
									<span>{season.d1Manager}</span>
								</span>
							{:else}
								<span class="unknown">—</span>
							{/if}
						</td>
						<td class="champion-cell pts-cell">
							{#if season.pointsChampion}
								<span class="mobile-label">Points Champion</span>
								<span class="team-row">
									<span class="team">{season.pointsChampion}</span>
									{#if season.pointsTotal}
										<span class="score-pill points">{season.pointsTotal.toLocaleString()} pts</span>
									{/if}
								</span>
								<span class="meta">
									<span>{season.pointsManager}</span>
								</span>
							{:else}
								<span class="mobile-label">Points Champion</span>
								<span class="unknown">Not tracked</span>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>
</div>

<style>
	.history-page {
		width: min(100%, 980px);
		margin: 0 auto;
		padding: 2rem 1rem 4rem;
	}

	.history-hero {
		text-align: center;
		margin-bottom: 1.75rem;
		animation: fade-up 0.45s ease both;
	}

	h1 {
		font-family: 'Dela Gothic One', sans-serif;
		font-size: clamp(2.35rem, 8vw, 5.35rem);
		font-weight: normal;
		line-height: 0.98;
		margin: 0;
		background-size: 250% auto;
	}

	.table-card {
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.035), transparent 160px),
			var(--bg-paper);
		border-radius: 8px;
		border: 1px solid rgba(255, 255, 255, 0.08);
		overflow: hidden;
		overflow-x: auto;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.22);
		animation: fade-up 0.45s 0.08s ease both;
	}

	.champions-table {
		width: 100%;
		border-collapse: collapse;
		table-layout: fixed;
	}

	thead th {
		background: rgba(255, 255, 255, 0.035);
		color: var(--text-secondary);
		font-size: 0.68rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		padding: 0.95rem 1rem;
		text-align: left;
	}

	.col-year { width: 120px; }
	.col-champion { width: auto; }

	.header-inner {
		display: flex;
		align-items: center;
		gap: 0.4em;
	}

	.header-icon {
		width: 1em;
		height: 1em;
		flex-shrink: 0;
		opacity: 0.9;
	}

	.header-d1 {
		background: color-mix(in srgb, var(--color-primary) 82%, #111);
		color: white;
		border-left: 1px solid rgba(255, 255, 255, 0.06);
	}

	.header-pts {
		background: color-mix(in srgb, var(--color-secondary) 84%, #111);
		color: white;
	}

	tbody tr {
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
		transition: background-color 0.15s ease;
	}

	tbody tr:last-child {
		border-bottom: none;
	}

	tbody tr:hover td {
		background: rgba(255, 255, 255, 0.035);
	}

	tbody tr.double-crown td {
		background: linear-gradient(90deg, rgba(245, 158, 11, 0.12), rgba(245, 158, 11, 0.035));
	}

	td {
		padding: 1rem;
		vertical-align: middle;
	}

	td.year {
		color: var(--text-primary);
		font-size: 1rem;
		font-weight: 700;
		text-align: left;
		white-space: nowrap;
	}

	td.year span:first-child {
		display: block;
	}

	.year-badge {
		display: inline-flex;
		margin-top: 0.35rem;
		padding: 0.22rem 0.45rem;
		border: 1px solid rgba(245, 158, 11, 0.45);
		border-radius: 999px;
		color: #fbbf24;
		font-size: 0.58rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.champion-cell {
		min-width: 0;
	}

	.d1-cell {
		border-left: 1px solid rgba(255, 255, 255, 0.06);
	}

	.pts-cell {
		border-left: 1px solid rgba(255, 255, 255, 0.06);
	}

	.mobile-label {
		display: none;
	}

	.team-row {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		min-width: 0;
	}

	.team {
		min-width: 0;
		overflow-wrap: anywhere;
		font-size: 0.98rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.score-pill {
		flex: none;
		padding: 0.22rem 0.48rem;
		border-radius: 999px;
		background: rgba(237, 75, 37, 0.14);
		color: #ff9b83;
		font-size: 0.68rem;
		font-weight: 800;
		line-height: 1;
	}

	.score-pill.points {
		background: rgba(51, 101, 151, 0.18);
		color: #9ec7ef;
	}

	.meta {
		display: block;
		margin-top: 0.32rem;
		font-size: 0.74rem;
		color: var(--text-secondary);
		opacity: 0.68;
	}

	.unknown {
		font-size: 0.82rem;
		color: var(--text-secondary);
		opacity: 0.45;
	}

	@keyframes fade-up {
		from {
			opacity: 0;
			transform: translateY(14px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 760px) {
		.history-page {
			padding-top: 1.5rem;
		}

		.table-card {
			background: transparent;
			border: 0;
			box-shadow: none;
			overflow: visible;
		}

		.champions-table,
		.champions-table thead,
		.champions-table tbody,
		.champions-table tr,
		.champions-table td {
			display: block;
			width: 100%;
		}

		.champions-table thead {
			display: none;
		}

		.champions-table tr {
			margin-bottom: 0.75rem;
			background:
				linear-gradient(180deg, rgba(255, 255, 255, 0.035), transparent),
				var(--bg-paper);
			border: 1px solid rgba(255, 255, 255, 0.08);
			border-radius: 8px;
			overflow: hidden;
		}

		.champions-table tr.double-crown {
			border-color: rgba(245, 158, 11, 0.26);
		}

		tbody tr.double-crown td,
		tbody tr:hover td {
			background: transparent;
		}

		td.year {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 0.75rem;
			background: rgba(255, 255, 255, 0.04);
			border-bottom: 1px solid rgba(255, 255, 255, 0.06);
		}

		td.year span:first-child {
			display: inline;
		}

		.year-badge {
			margin-top: 0;
		}

		.d1-cell,
		.pts-cell {
			border-left: 0;
		}

		.d1-cell {
			border-bottom: 1px solid rgba(255, 255, 255, 0.06);
		}

		.mobile-label {
			display: block;
			margin-bottom: 0.35rem;
			color: var(--text-secondary);
			font-size: 0.64rem;
			font-weight: 800;
			letter-spacing: 0.11em;
			text-transform: uppercase;
			opacity: 0.58;
		}
	}

	@media (max-width: 440px) {
		.history-page {
			padding-inline: 0.75rem;
		}

		td {
			padding: 0.85rem;
		}

		.team-row {
			align-items: flex-start;
			flex-direction: column;
			gap: 0.45rem;
		}
	}
</style>
