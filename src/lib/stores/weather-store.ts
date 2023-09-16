import { ndk } from '$lib/stores/ndk';
import type { NDKFilter, NDKKind } from '@nostr-dev-kit/ndk';
import { get as getStore } from 'svelte/store';

// Create a filter
const filter: NDKFilter = {
	kinds: [5732 as NDKKind],
	authors: ['098ef66bce60dd4cf10b4ae5949d1ec6dd777ddeb4bc49b47f97275a127a63cf']
};

const $ndk = getStore(ndk);

// Will return all found events
export const weatherStore = $ndk.storeSubscribe(filter, { closeOnEose: false });
