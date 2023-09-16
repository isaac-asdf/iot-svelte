<script lang="ts">
	import { weatherStore } from '$lib/stores/weather-store';
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
	export let marginTop = 20;
	export let marginRight = 20;
	export let marginBottom = 20;
	export let marginLeft = 20;

	$: x = d3.scaleTime(
		d3.extent(data, (d: WeatherPoint) => d.time),
		[marginLeft, width - marginRight]
	);
	$: y = d3.scaleLinear(
		d3.extent(data, (d: WeatherPoint) => d.temp),
		[marginTop, height - marginBottom]
	);
	$: line = d3
		.line()
		.curve(d3.curveLinear)
		.x((d: WeatherPoint) => x(d.time))
		.y((d: WeatherPoint) => y(d.temp));
</script>

<svg {width} {height}>
	<path fill="none" stroke="currentColor" stroke-width="1.5" d={line(data)} />
	<g fill="white" stroke="currentColor" stroke-width="1.5">
		{#each data as d, i}
			<circle cx={x(d.time)} cy={y(d.temp)} r="1" />
		{/each}
	</g>
</svg>
