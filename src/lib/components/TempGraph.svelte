<script lang="ts">
	import { weatherStore } from '$lib/stores/weather-store';
	// @ts-ignore
	import * as d3 from 'd3';
	import { fly } from 'svelte/transition';

	type WeatherPoint = { temp: number; time: Date };

	let data: WeatherPoint[] = [
		{ temp: 56, time: new Date('2023-01-21') },
		{ temp: 58, time: new Date('2023-02-22') },
		{ temp: 61, time: new Date('2023-03-23') },
		{ temp: 55, time: new Date('2023-04-24') },
		{ temp: 40, time: new Date('2023-05-25') }
	];

	// $weatherStore.forEach((event) => {
	// 	const time = new Date(event.created_at! * 1000).getMinutes();
	// 	const temp = parseFloat(event.content);
	// 	// const temp = celsiusToF(parseFloat(event.content));
	// 	data.push({ temp, time });
	// });

	let ctx;

	function celsiusToF(celsius: number): number {
		return (celsius * 9) / 5 + 32;
	}

	export let width = 640;
	export let height = 400;
	export let marginTop = 20;
	export let marginRight = 20;
	export let marginBottom = 20;
	export let marginLeft = 20;

	$: x = d3.scaleTime(
		[d3.extent(data, (d: WeatherPoint) => d.time)],
		[marginLeft, width - marginRight]
	);
	$: y = d3.scaleLinear(
		[d3.extent(data, (d: WeatherPoint) => d.temp)],
		[height - marginBottom, marginTop]
	);
	$: line = d3
		.line()
		.curve(d3.curveNatural)
		.x((d: WeatherPoint) => d.time)
		.y((d: WeatherPoint) => d.temp);
</script>

<svg {width} {height} class="bg-slate-200">
	<path fill="none" stroke="black" stroke-width="1.5" d={line(data)} />
	{#each data as d, i}
		<circle cx={d.time.getUTCDate()} cy={d.temp} r="3" in:fly={{ duration: 5000, delay: i * 15 }} />
	{/each}
</svg>
