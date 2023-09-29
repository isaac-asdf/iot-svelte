<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import { ndk } from '$lib/stores/ndk';
	import { RelayList } from '@nostr-dev-kit/ndk-svelte-components';
</script>

<div class="p-1">
	<h1 class="text-2xl">Config page</h1>
	<Button onClick={() => goto('/')} label="Return home" />
	<div>
		Relays:
		<RelayList ndk={$ndk} />
	</div>
</div>
