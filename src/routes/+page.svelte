<script lang="ts">
	import jsonData from '$lib/data/allTheData.json';

	const teamCount = jsonData.theData.length;
	const leagueCount = new Set(jsonData.theData.map((t: any) => t.leagueId)).size;

</script>

<div class="home">
	<section class="hero">
		<h1 class="sos-gradient">Sultans of Stats</h1>
<div class="league-stats">
			<span>4 Divisions</span>
			<span class="dot">·</span>
			<span>{leagueCount} Leagues</span>
			<span class="dot">·</span>
			<span>{teamCount} Teams</span>
		</div>
	</section>

	<p class="description">
		A fantasy baseball superleague with yearly promotion and relegation based on individual league
		and overall division standings, hosted on
		<a href="https://www.fantrax.com/" target="_blank">Fantrax</a>. Learn more on the
		<a href="https://www.reddit.com/r/SultansOfStats/" target="_blank">subreddit</a> or
		<a href="https://discord.gg/hkCQabyaDn" target="_blank">Discord</a>.
	</p>

	<div class="nav-cards">
		<a href="/leaderboard" class="nav-card leaderboard-card">
			<svg class="card-icon" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
				<path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V17H9v2h6v-2h-2v-2.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 11.63 21 9.55 21 7V6c0-1.1-.9-2-2-2zM7 10.82C5.84 10.4 5 9.3 5 8V7h2v3.82zM12 14c-1.65 0-3-1.35-3-3V5h6v6c0 1.65-1.35 3-3 3zm7-6c0 1.3-.84 2.4-2 2.82V7h2v1z" />
			</svg>
			<div>
				<h2>Leaderboard</h2>
				<p>Current standings across all divisions</p>
			</div>
		</a>

		<a href="/charts" class="nav-card charts-card">
			<svg class="card-icon" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
				<path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" />
			</svg>
			<div>
				<h2>Charts</h2>
				<p>Track stat history through the season</p>
			</div>
		</a>
	</div>

	<p class="contribute">
		Handy with code? <a href="https://github.com/danhogan/sultansofstats" target="_blank">Contribute on GitHub</a>.
	</p>
</div>

<style>
	.home {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 3em 1em 4em;
		max-width: 860px;
		margin: 0 auto;
	}

	/* ── Hero ─────────────────────────────────── */

	.hero {
		text-align: center;
		margin-bottom: 2em;
		animation: fade-up 0.5s ease both;
	}

	h1 {
		font-family: 'Dela Gothic One', sans-serif;
		font-size: min(9vw, 6rem);
		font-weight: normal;
		white-space: nowrap;
		margin: 0 0 0.25em;
		line-height: 1;
		background-size: 250% auto;
		animation: gradient-flow 8s ease-in-out infinite;
	}

	@keyframes gradient-flow {
		0%   { background-position: 0% center; }
		50%  { background-position: 200% center; }
		100% { background-position: 0% center; }
	}

.league-stats {
		display: inline-flex;
		align-items: center;
		gap: 0.6em;
		font-size: 0.78rem;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--text-secondary);
		opacity: 0.6;
	}

	.dot { opacity: 0.4; }

	/* ── Description ──────────────────────────── */

	.description {
		max-width: 58ch;
		text-align: center;
		line-height: 1.75;
		color: var(--text-secondary);
		margin-bottom: 2.5em;
		animation: fade-up 0.5s 0.1s ease both;
	}

	/* ── Nav cards ────────────────────────────── */

	.nav-cards {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1em;
		width: 100%;
		max-width: 560px;
		margin-bottom: 2.5em;
	}

	.nav-card {
		display: flex;
		align-items: center;
		gap: 1em;
		padding: 1.25em 1.4em;
		background-color: var(--bg-paper);
		border-radius: 8px;
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-left: 3px solid transparent;
		text-decoration: none;
		color: inherit;
		transition: transform 0.15s ease, box-shadow 0.15s ease;
		animation: fade-up 0.5s 0.2s ease both;
	}

	.nav-card:hover {
		transform: translateY(-3px);
	}

	.leaderboard-card { border-left-color: var(--color-primary); }
	.leaderboard-card:hover { box-shadow: 0 6px 24px rgba(237, 75, 37, 0.2); }
	.leaderboard-card .card-icon { color: var(--color-primary); }

	.charts-card { border-left-color: var(--color-secondary); }
	.charts-card:hover { box-shadow: 0 6px 24px rgba(51, 101, 151, 0.3); }
	.charts-card .card-icon { color: var(--color-secondary); }

	.card-icon {
		width: 2rem;
		height: 2rem;
		flex-shrink: 0;
	}

	.nav-card h2 {
		font-size: 1rem;
		font-weight: 600;
		margin: 0 0 0.2em;
		color: var(--text-primary);
	}

	.nav-card p {
		font-size: 0.8rem;
		color: var(--text-secondary);
		margin: 0;
		line-height: 1.4;
	}

	/* ── Contribute ───────────────────────────── */

	.contribute {
		font-size: 0.82rem;
		color: var(--text-secondary);
		opacity: 0.55;
		animation: fade-up 0.5s 0.3s ease both;
	}

	/* ── Shared animation ─────────────────────── */

	@keyframes fade-up {
		from { opacity: 0; transform: translateY(16px); }
		to   { opacity: 1; transform: translateY(0); }
	}

	/* ── Mobile ───────────────────────────────── */

	@media (max-width: 480px) {
		.nav-cards {
			grid-template-columns: 1fr;
		}
	}
</style>
