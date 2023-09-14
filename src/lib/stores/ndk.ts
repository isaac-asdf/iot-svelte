import NDKSvelte from '@nostr-dev-kit/ndk-svelte';
import { writable } from 'svelte/store';

const _ndk = new NDKSvelte({
	explicitRelayUrls: ['ws://localhost:7000']
});
_ndk.connect();

export const ndk = writable(_ndk);
