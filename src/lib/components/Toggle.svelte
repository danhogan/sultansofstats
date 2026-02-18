<script lang="ts">
	let { onfilter }: { onfilter: (division: number) => void } = $props();

	let selected = $state(0);

	const options = [
		{ value: 0, label: 'All' },
		{ value: 1, label: 'D1' },
		{ value: 2, label: 'D2' },
		{ value: 3, label: 'D3' },
		{ value: 4, label: 'D4' }
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
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 4px;
		overflow: hidden;
	}

	button {
		background: none;
		border: none;
		border-right: 1px solid rgba(255, 255, 255, 0.3);
		color: var(--text-primary);
		cursor: pointer;
		padding: 6px 16px;
		font-size: 0.875rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		transition: background-color 0.15s;
	}

	button:last-child {
		border-right: none;
	}

	button:hover {
		background-color: rgba(255, 255, 255, 0.1);
	}

	button.active {
		background-color: var(--color-secondary);
		color: #fff;
	}
</style>
