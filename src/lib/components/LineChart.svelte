<script lang="ts">
	import { onMount } from 'svelte';

	let { data, selectedStat }: { data: any[]; selectedStat: string } = $props();

	let el: HTMLDivElement;
	let chart: any = null;

	function buildOptions() {
		return {
			colors: [
				'#3D44CA',
				'#CA3D3D',
				'#E0CF42',
				'#59DB3F',
				'#E5AF34',
				'#AA50E1',
				'#A07C35',
				'#DF67D4',
				'#a9ed87',
				'#E5E5E5',
				'#979797',
				'#aaffc3',
				'#5DC3C2',
				'#90cde0',
				'#3ff527',
				'#f52727'
			],
			series: data,
			chart: {
				type: 'line' as const,
				foreColor: '#BBB',
				background: 'transparent'
			},
			xaxis: {
				title: { text: 'Day' }
			},
			yaxis: {
				labels: {
					formatter(val: any) {
						if (['ERA', 'WHP', 'OBP', 'OPS'].includes(selectedStat)) {
							return parseFloat(val).toFixed(4);
						}
						return parseFloat(val).toFixed(0);
					}
				}
			},
			tooltip: { theme: 'dark' },
			theme: { mode: 'dark' as const }
		};
	}

	onMount(async () => {
		// Dynamic import prevents apexcharts from running during SSR/prerender
		const ApexCharts = (await import('apexcharts')).default;
		chart = new ApexCharts(el, buildOptions());
		chart.render();
		return () => chart?.destroy();
	});

	$effect(() => {
		if (chart) {
			chart.updateOptions(buildOptions(), true, true);
		}
	});
</script>

<div bind:this={el}></div>
