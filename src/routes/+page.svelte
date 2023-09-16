<script lang="ts">
	import TempGraph from '$lib/components/TempGraph.svelte';
	import { ndk } from '$lib/stores/ndk';
	import type { NDKFilter, NDKKind, NDKUser } from '@nostr-dev-kit/ndk';
	import { RelayList } from '@nostr-dev-kit/ndk-svelte-components';

	// Create a filter
	const filter: NDKFilter = {
		kinds: [5732 as NDKKind],
		authors: ['098ef66bce60dd4cf10b4ae5949d1ec6dd777ddeb4bc49b47f97275a127a63cf']
	};
	// Will return all found events
	const events = $ndk.storeSubscribe(filter, { closeOnEose: false });

	let showRelays = false;
</script>

<svelte:head>
	<title>Nostr Weather</title>
</svelte:head>

<div class="margin:40px">
	<h1>Nostr Weather Report</h1>
	<button class="bg-slate-200 hover:bg-slate-300" on:click={() => (showRelays = !showRelays)}
		>Click for relays</button
	>
	<TempGraph />

	{#if showRelays}
		<RelayList ndk={$ndk} />
	{/if}
</div>
