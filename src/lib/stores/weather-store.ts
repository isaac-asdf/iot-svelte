import { browser } from '$app/environment';
import { ndk } from '$lib/stores/ndk';
import { fromLocalStorage, toLocalStorage } from '$lib/utils';
import type { NDKFilter, NDKKind } from '@nostr-dev-kit/ndk';
import { get as getStore, writable } from 'svelte/store';

const localAuthors = fromLocalStorage('authors', null);
const defaultAuthors = ['098ef66bce60dd4cf10b4ae5949d1ec6dd777ddeb4bc49b47f97275a127a63cf'];
const _authors: string[] = localAuthors && browser ? JSON.parse(localAuthors) : defaultAuthors;

export const authors = writable(_authors);
authors.subscribe((value) => toLocalStorage('authors', JSON.stringify(value)));

// Create a filter
const filter: NDKFilter = {
	kinds: [5732 as NDKKind],
	authors: _authors
};

const $ndk = getStore(ndk);

// Will return all found events
export const weatherStore = $ndk.storeSubscribe(filter, { closeOnEose: false });
