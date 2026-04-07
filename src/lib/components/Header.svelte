<script lang="ts">
	import { page } from '$app/stores';

	let menuOpen = $state(false);

	const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Leaderboard', href: '/leaderboard' },
    { label: 'Charts', href: '/charts' },
    { label: 'History', href: '/history' },
];

	function toggleMenu() { menuOpen = !menuOpen; }
	function closeMenu() { menuOpen = false; }
</script>

<header>
	<div class="inner">
		<a href="/" class="logo" onclick={closeMenu}>
			<span class="logo-text sos-gradient">Sultans of Stats</span>
		</a>

		<nav class="desktop-nav">
			{#each navLinks as link}
				<a
					href={link.href}
					class:active={$page.url.pathname === link.href}
				>{link.label}</a>
			{/each}
		</nav>

		<button class="hamburger" onclick={toggleMenu} aria-label="Toggle menu" aria-expanded={menuOpen}>
			<span></span>
			<span></span>
			<span></span>
		</button>
	</div>

	{#if menuOpen}
		<nav class="mobile-nav">
			{#each navLinks as link}
				<a
					href={link.href}
					class:active={$page.url.pathname === link.href}
					onclick={closeMenu}
				>{link.label}</a>
			{/each}
		</nav>
	{/if}
</header>

<style>
	header {
		position: sticky;
		top: 0;
		z-index: 100;
		background: rgba(14, 14, 14, 0.9);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-bottom: 1px solid rgba(255, 255, 255, 0.07);
	}

	.inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1.5em;
		height: 44px;
	}

	/* ── Logo ─────────────────────────────────── */

	.logo {
		text-decoration: none;
	}

	.logo-text {
		font-family: 'Dela Gothic One', sans-serif;
		font-size: 1rem;
		font-weight: normal;
		white-space: nowrap;
		background-size: 250% auto;
		background-position: 0% center;
	}

	.logo:hover .logo-text {
		animation: logo-sweep 0.8s ease forwards;
	}

	@keyframes logo-sweep {
		from { background-position: 0% center; }
		to   { background-position: 200% center; }
	}

	/* ── Desktop nav ──────────────────────────── */

	.desktop-nav {
		display: flex;
		align-items: center;
		gap: 0.25em;
	}

	.desktop-nav a {
		color: var(--text-secondary);
		text-decoration: none;
		font-size: 0.875rem;
		font-weight: 500;
		padding: 0.3em 0.75em;
		border-bottom: 1.5px solid transparent;
		transition: color 0.15s ease, border-color 0.15s ease;
	}

	.desktop-nav a:hover,
	.desktop-nav a.active {
		color: #fff;
		border-bottom-color: var(--color-primary);
	}

	/* ── Hamburger ────────────────────────────── */

	.hamburger {
		display: none;
		flex-direction: column;
		justify-content: center;
		gap: 5px;
		background: none;
		border: none;
		cursor: pointer;
		padding: 6px;
		color: var(--text-secondary);
		transition: color 0.15s;
	}

	.hamburger:hover { color: #fff; }

	.hamburger span {
		display: block;
		width: 20px;
		height: 1.5px;
		background: currentColor;
	}

	/* ── Mobile nav ───────────────────────────── */

	.mobile-nav {
		display: flex;
		flex-direction: column;
		border-top: 1px solid rgba(255, 255, 255, 0.06);
		padding: 0.4em 0;
	}

	.mobile-nav a {
		color: var(--text-secondary);
		text-decoration: none;
		font-size: 0.875rem;
		font-weight: 500;
		padding: 0.75em 1.5em;
		transition: color 0.15s ease;
	}

	.mobile-nav a:hover,
	.mobile-nav a.active {
		color: #fff;
	}

	/* ── Responsive ───────────────────────────── */

	@media (max-width: 640px) {
		.desktop-nav { display: none; }
		.hamburger { display: flex; }
	}
</style>
