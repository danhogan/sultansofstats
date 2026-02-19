<script lang="ts">
	let { onfilter }: { onfilter: (division: number) => void } = $props();

	let selected = $state(0);

	const options = [
		{ value: 0, label: 'All', color: '#ed4b25' },
		{ value: 1, label: 'D1',  color: '#eab308' },
		{ value: 2, label: 'D2',  color: '#a78bfa' },
		{ value: 3, label: 'D3',  color: '#38bdf8' },
		{ value: 4, label: 'D4',  color: '#9ca3af' },
	];

	function select(value: number) {
		selected = value;
		onfilter(value);
	}
</script>

<div class="toggle-group" role="group" aria-label="Division filter">
	{#each options as opt}
		<button
			class:active={selected === opt.value}
			style="--c:{opt.color}"
			onclick={() => select(opt.value)}
			aria-pressed={selected === opt.value}
		>
			{opt.label}
		</button>
	{/each}
</div>

<style>
	.toggle-group {
		display: flex;
		gap: 6px;
	}

	button {
		background: none;
		border: 1.5px solid color-mix(in srgb, var(--c) 38%, transparent);
		border-radius: 999px;
		color: var(--text-secondary);
		cursor: pointer;
		padding: 5px 14px;
		font-size: 0.78rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		transition: background 0.15s, border-color 0.15s, color 0.15s;
		white-space: nowrap;
	}

	button:hover:not(.active) {
		background: color-mix(in srgb, var(--c) 10%, transparent);
		border-color: color-mix(in srgb, var(--c) 65%, transparent);
		color: #fff;
	}

	button.active {
		background: color-mix(in srgb, var(--c) 20%, transparent);
		border-color: var(--c);
		color: var(--c);
	}
</style>
