<script lang="ts">
	import { ndk } from '$lib/stores/ndk';
	import type { NDKFilter, NDKUser } from '@nostr-dev-kit/ndk';
	import { RelayList } from '@nostr-dev-kit/ndk-svelte-components';
	import { onMount } from 'svelte';

	let showRelays = false;

	const weather = $ndk.storeSubscribe({ kinds: [1] }, { closeOnEose: false });

	const seenMessages: string[] = [];

	$weather.forEach((event) => {
		seenMessages.push(event.content);
	});

	let users: NDKUser[] = [];
	// const myWeather = $ndk.getUser({
	// 	hexpubkey: '098ef66bce60dd4cf10b4ae5949d1ec6dd777ddeb4bc49b47f97275a127a63cf'
	// });
	// users.push(myWeather);

	onMount(async () => {
		const hexPubkeys = ['098ef66bce60dd4cf10b4ae5949d1ec6dd777ddeb4bc49b47f97275a127a63cf'];

		hexPubkeys.forEach((hexpubkey: string) => {
			const user = $ndk.getUser({ hexpubkey });
			user.fetchProfile().then(() => {
				users.push(user);
				users = users;
			});
		});

		// Create a filter
		const filter: NDKFilter = {
			kinds: [1]
		};

		// Will return all found events
		let events = await $ndk.fetchEvents(filter);
		events.forEach((event) => {
			seenMessages.push(event.content);
		});
	});
</script>

<svelte:head>
	<title>Nostr Weather</title>
</svelte:head>

<div>
	<h1>Nostr Weather Report</h1>
	{#each users as user}
		<li>{user.npub}</li>
	{/each}
	{#each seenMessages as msg}
		<li>{msg}</li>
	{/each}
	<button class="bg-slate-200 hover:bg-slate-300" on:click={() => (showRelays = !showRelays)}
		>Click for relays</button
	>
	{#if showRelays}
		<RelayList ndk={$ndk} />
	{/if}
</div>
