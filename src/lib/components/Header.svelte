<script lang="ts">
	let menuOpen = $state(false);

	const pages = [
		{ label: 'Home', href: '/' },
		{ label: 'Leaderboard', href: '/leaderboard' },
		{ label: 'Charts', href: '/charts' }
	];

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	function closeMenu() {
		menuOpen = false;
	}
</script>

<header>
	<div class="toolbar">
		<!-- Desktop logo -->
		<a href="/" class="main-logo desktop-logo">
			<img src="/images/sos.jpg" alt="Sultans of Stats logo" />
		</a>

		<!-- Mobile hamburger -->
		<button class="hamburger" onclick={toggleMenu} aria-label="Toggle navigation menu">
			<span></span>
			<span></span>
			<span></span>
		</button>

		<!-- Mobile logo (center) -->
		<a href="/" class="main-logo mobile-logo">
			<img src="/images/sos.jpg" alt="Sultans of Stats logo" />
		</a>

		<!-- Desktop nav -->
		<nav class="desktop-nav">
			{#each pages as page}
				<a href={page.href}>{page.label}</a>
			{/each}
		</nav>
	</div>

	<!-- Mobile dropdown -->
	{#if menuOpen}
		<nav class="mobile-nav">
			{#each pages as page}
				<a href={page.href} onclick={closeMenu}>{page.label}</a>
			{/each}
		</nav>
	{/if}
</header>

<style>
	header {
		background-color: var(--color-primary);
		color: #fff;
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.toolbar {
		display: flex;
		align-items: center;
		padding: 0 1em;
		min-height: 56px;
	}

	.desktop-logo {
		margin-right: 1em;
		flex-shrink: 0;
	}

	.mobile-logo {
		display: none;
	}

	.hamburger {
		display: none;
		flex-direction: column;
		gap: 5px;
		background: none;
		border: none;
		cursor: pointer;
		padding: 8px;
		margin-right: 0.5em;
		flex-shrink: 0;
	}

	.hamburger span {
		display: block;
		width: 24px;
		height: 2px;
		background-color: #fff;
	}

	.desktop-nav {
		display: flex;
		gap: 0.5em;
		align-items: center;
	}

	.desktop-nav a,
	.mobile-nav a {
		color: #fff;
		text-decoration: none;
		padding: 0.5em 1em;
		border-radius: 4px;
		font-size: 0.9rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.desktop-nav a:hover,
	.mobile-nav a:hover {
		background-color: rgba(255, 255, 255, 0.15);
	}

	.mobile-nav {
		display: flex;
		flex-direction: column;
		background-color: var(--color-primary);
		padding: 0.5em 0;
		border-top: 1px solid rgba(255, 255, 255, 0.2);
	}

	.mobile-nav a {
		padding: 0.75em 1.5em;
	}

	/* Main logo image sizing */
	:global(.main-logo img) {
		max-height: 3em;
		aspect-ratio: 150 / 143;
		display: block;
	}

	@media (max-width: 768px) {
		.desktop-logo {
			display: none;
		}
		.desktop-nav {
			display: none;
		}
		.hamburger {
			display: flex;
		}
		.mobile-logo {
			display: block;
			flex-grow: 1;
			text-align: center;
		}
	}
</style>
