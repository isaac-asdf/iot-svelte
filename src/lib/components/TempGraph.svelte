<script lang="ts">
	import { weatherStore } from '$lib/stores/weather-store';
	import Axis from './Axis.svelte';
	// @ts-ignore
	import * as d3 from 'd3';

	type WeatherPoint = { temp: number; time: Date };

	let data: WeatherPoint[] = [];
	// const yesterday = new Date(2023, 8, 15);
	// for (let i = 0; i < 100; i++) {
	// 	const hours = Math.floor(i / 10) + 1;
	// 	const minutes = (i % 10) * 6;
	// 	let time = new Date();
	// 	Object.assign(time, yesterday);
	// 	time.setHours(hours);
	// 	time.setMinutes(minutes);
	// 	data.push({
	// 		temp: Math.sin(i) * 50 + 50,
	// 		time
	// 	});
	// }

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

	$: timeExtent = d3.extent(data, (d: WeatherPoint) => d.time);
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
	<g fill="white" stroke="currentColor" stroke-width="1">
		{#each data as d, i}
			<circle cx={x(d.time)} cy={y(d.temp)} r="1" />
		{/each}
	</g>
</svg>
