<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import { ndk, explicitRelayUrls } from '$lib/stores/ndk';
	import { authors } from '$lib/stores/weather-store';
	import { RelayList } from '@nostr-dev-kit/ndk-svelte-components';

	let value = '';
	let authorInput = '';
	function addAuthor() {
		$authors.push(authorInput);
		authorInput = '';
	}

	function removeAuthor(relay: string) {
		$authors = $authors.filter((val) => val !== relay);
	}
	function addRelay() {
		$explicitRelayUrls.push(value);
		value = '';
	}

	function removeRelay(relay: string) {
		$explicitRelayUrls = $explicitRelayUrls.filter((val) => val !== relay);
	}
</script>

<div class="p-1">
	<h1 class="text-2xl">Config page</h1>
	<Button onClick={() => goto('/')} label="Return home" />
	<h2>Selected relays:</h2>
	{#each $explicitRelayUrls as relay}
		<li>
			{relay}
			<button class="bg-red-600 hover:bg-red-400 px-1" on:click={() => removeRelay(relay)}>X</button
			>
		</li>
	{/each}
	<input class="border-2 border-black" bind:value />
	<button
		class="border-2 border-slate-800 hover:bg-slate-200 rounded px-1"
		on:click={() => addRelay()}>Add Relay</button
	>
	<br />
	<br />
	<h2>Selected authors:</h2>
	{#each $authors as author}
		<li>
			{author}
			<button class="bg-red-600 hover:bg-red-400 px-1" on:click={() => removeAuthor(author)}
				>X</button
			>
		</li>
	{/each}
	<input class="border-2 border-black" bind:value={authorInput} />
	<button
		class="border-2 border-slate-800 hover:bg-slate-200 rounded px-1"
		on:click={() => addAuthor()}>Add Author</button
	>
	<div>
		<br />
		Relay Statuses:
		<RelayList ndk={$ndk} />
	</div>
</div>
