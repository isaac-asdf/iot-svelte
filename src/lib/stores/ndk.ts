import { browser } from '$app/environment';
import { fromLocalStorage, toLocalStorage } from '$lib/utils';
import NDKSvelte from '@nostr-dev-kit/ndk-svelte';
import { writable } from 'svelte/store';

const localRelays = fromLocalStorage('relays', null);
const defaultRelays = ['ws://192.168.0.24:7000'];
const _explicitRelayUrls: string[] =
	localRelays && browser ? JSON.parse(localRelays) : defaultRelays;

export const explicitRelayUrls = writable(_explicitRelayUrls);
explicitRelayUrls.subscribe((value) => toLocalStorage('relays', JSON.stringify(value)));

const _ndk = new NDKSvelte({
	explicitRelayUrls: _explicitRelayUrls
});
_ndk.connect();

export const ndk = writable(_ndk);
