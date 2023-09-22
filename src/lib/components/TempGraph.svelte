<script lang="ts">
	import { timeFilter } from '$lib/stores/time-filter';
	import { weatherStore } from '$lib/stores/weather-store';
	import Axis from './Axis.svelte';
	// @ts-ignore
	import * as d3 from 'd3';
	import { onMount } from 'svelte';
	import { onDestroy } from 'svelte';
	import { derived } from 'svelte/store';

	type WeatherPoint = { temp: number; time: Date };

	weatherStore.ref();
	onDestroy(() => {
		weatherStore.unref();
	});

	const data = derived([weatherStore, timeFilter], ([$weatherStore, $timeFilter]) => {
		return $weatherStore
			.map((val) => {
				const time = new Date(val.created_at! * 1000);
				const celsius = parseFloat(val.content);
				const temp = celsiusToF(celsius);
				return {
					temp,
					time
				};
			})
			.filter(({ time }) => {
				console.log(time.getTime());
				console.log($timeFilter.low);
				console.log($timeFilter.high);
				const timeRangeFits =
					time.getTime() > $timeFilter.low.getTime() && time.getTime() < $timeFilter.high.getTime();
				if ($timeFilter.useFilter) {
				}
				return !$timeFilter.useFilter || timeRangeFits;
			});
	});

	function celsiusToF(celsius: number): number {
		return (celsius * 9) / 5 + 32;
	}

	export let width = 640;
	export let height = 400;
	export let margin = 30;

	$: timeExtent = d3.extent($data, (d: WeatherPoint) => d.time);
	$: x = d3.scaleTime(timeExtent, [margin, width - margin]);
	$: y = d3.scaleLinear(d3.extent($data, (d: WeatherPoint) => d.temp).reverse(), [
		margin * 2,
		height - margin
	]);
	$: line = d3
		.line()
		.curve(d3.curveLinear)
		.x((d: WeatherPoint) => x(d.time))
		.y((d: WeatherPoint) => y(d.temp));
</script>

<div>
	<!-- <svg class="width:100% max-w-screen-sm" viewBox="0 0 {width + margin * 2} {height + margin * 2}"> -->
	<svg viewBox="0 0 {width + margin * 2} {height + margin * 2}">
		<path fill="none" stroke="currentColor" stroke-width="1.5" d={line($data)} />
		<Axis {width} {height} {margin} scale={x} position="bottom" />
		<Axis {width} {height} {margin} scale={y} position="left" />
		<text y={height} x={width / 2}>Time</text>
		{#if $data.length > 0}
			<text y={margin} x={margin / 2}
				>Temperature in &degF from {timeExtent[0].toLocaleDateString()} to {timeExtent[1].toLocaleDateString()}</text
			>
		{/if}
		<g fill="white" stroke="currentColor" stroke-width="1.5">
			{#each $data as d}
				{#if d}
					<circle cx={x(d.time)} cy={y(d.temp)} r="1" />
				{/if}
			{/each}
		</g>
	</svg>
</div>
