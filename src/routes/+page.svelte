<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import TempGraph from '$lib/components/TempGraph.svelte';
	import { ndk } from '$lib/stores/ndk';
	import { timeFilter } from '$lib/stores/time-filter';
	import type { NDKFilter, NDKKind, NDKUser } from '@nostr-dev-kit/ndk';

	// Create a filter
	const filter: NDKFilter = {
		kinds: [5732 as NDKKind],
		authors: ['098ef66bce60dd4cf10b4ae5949d1ec6dd777ddeb4bc49b47f97275a127a63cf']
	};
	// Will return all found events
	const events = $ndk.storeSubscribe(filter, { closeOnEose: false });

	let timeRangeInput: { low: Date | null; high: Date | null } = { low: null, high: null };

	let inputTimeChange = () => {
		$timeFilter.useFilter = false;
		if (timeRangeInput.low && timeRangeInput.high) {
			if (timeRangeInput.high > timeRangeInput.low) {
				const low = new Date(timeRangeInput!.low);
				const high = new Date(timeRangeInput!.high);
				$timeFilter = { low, high, useFilter: true };
			}
		}
	};
</script>

<svelte:head>
	<title>Nostr Weather</title>
</svelte:head>

<div class="p-1">
	<h1 class="p-1 font-bold text-2xl bg-gradient-to-r from-blue-400">Nostr Weather Report</h1>
	<div class="border-b-2 hover:border-2 max-w-max">
		<label for="minDate">Min. Date:</label>
		<input
			class="text-slate-400"
			id="minDate"
			type="datetime-local"
			bind:value={timeRangeInput.low}
			on:change={inputTimeChange}
		/>
	</div>
	<div class="border-b-2 hover:border-2 max-w-max">
		<label for="maxDate">Max Date:</label>
		<input
			class="text-slate-400"
			id="maxDate"
			type="datetime-local"
			bind:value={timeRangeInput.high}
			on:change={inputTimeChange}
		/>
	</div>
	<TempGraph />

	<Button onClick={() => goto('/config')} label="Configuration" />
</div>
