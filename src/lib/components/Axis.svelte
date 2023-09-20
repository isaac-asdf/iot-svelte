<script lang="ts">
	// @ts-ignore
	import { select, selectAll, axisBottom, axisLeft } from 'd3';

	export let width: number;
	export let height: number;
	export let margin: number;
	export let position: string;
	export let scale: number;

	let transform: string;
	let g: SVGElement;

	$: {
		select(g).selectAll('*').remove();

		let axis;
		switch (position) {
			case 'bottom':
				axis = axisBottom(scale).tickSizeOuter(0);
				transform = `translate(0, ${height - margin})`;
				break;
			case 'left':
				axis = axisLeft(scale).tickSizeOuter(0);
				transform = `translate(${margin}, 0)`;
		}

		select(g).call(axis);
	}
</script>

<g class="axis" {width} bind:this={g} {transform} />
