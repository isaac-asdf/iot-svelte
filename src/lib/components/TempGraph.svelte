<script lang="ts">
	import { weatherStore } from '$lib/stores/weather-store';
	import Axis from './Axis.svelte';
	// @ts-ignore
	import * as d3 from 'd3';

	type WeatherPoint = { temp: number; time: Date };

	let data: WeatherPoint[] = [];

	$weatherStore.forEach((event) => {
		const time = new Date(event.created_at! * 1000);
		const celsius = parseFloat(event.content);
		const temp = celsiusToF(celsius);
		data.push({ temp, time });
	});

	let ctx;

	function celsiusToF(celsius: number): number {
		return (celsius * 9) / 5 + 32;
	}

	export let width = 640;
	export let height = 400;
	export let margin = 30;

	let minTime: Date | null = null;
	let maxTime: Date | null = null;

	let inputTimeChange = () => {
		if (minTime && maxTime) {
			if (minTime > maxTime) {
				const temp = minTime;
				minTime = maxTime;
				maxTime = temp;
			}
		}
	};

	$: timeExtent = d3.extent(data, (d: WeatherPoint) => d.time);
	if (minTime && maxTime) {
		console.log('time changed');
		timeExtent[0] = minTime;
		timeExtent[1] = maxTime;
	}
	$: x = d3.scaleTime(timeExtent, [margin, width - margin]);
	$: y = d3.scaleLinear(d3.extent(data, (d: WeatherPoint) => d.temp).reverse(), [
		margin * 2,
		height - margin
	]);
	$: line = d3
		.line()
		.curve(d3.curveLinear)
		.x((d: WeatherPoint) => x(d.time))
		.y((d: WeatherPoint) => y(d.temp));
</script>

<div class="border-b-2 hover:border-2 max-w-max">
	<label for="minDate">Min. Date:</label>
	<input
		class="text-slate-400"
		id="minDate"
		type="datetime-local"
		bind:value={minTime}
		on:change={inputTimeChange}
	/>
</div>
<div class="border-b-2 hover:border-2 max-w-max">
	<label for="maxDate">Max Date:</label>
	<input
		class="text-slate-400"
		id="maxDate"
		type="datetime-local"
		bind:value={maxTime}
		on:change={inputTimeChange}
	/>
</div>

<svg {width} {height}>
	<path fill="none" stroke="currentColor" stroke-width="1.5" d={line(data)} />
	<Axis {width} {height} {margin} scale={x} position="bottom" />
	<Axis {width} {height} {margin} scale={y} position="left" />
	<text y={height} x={width / 2}>Time</text>
	{#if data.length > 0}
		<text y={margin} x={margin / 2}
			>Temperature in &degF from {timeExtent[0].toLocaleDateString()} to {timeExtent[1].toLocaleDateString()}</text
		>
	{/if}
	<g fill="white" stroke="currentColor" stroke-width="1.5">
		{#each data as d, i}
			<circle cx={x(d.time)} cy={y(d.temp)} r="1" />
		{/each}
	</g>
</svg>
