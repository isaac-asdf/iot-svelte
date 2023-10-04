import { browser } from '$app/environment';

export function fromLocalStorage(storageKey: string, fallbackValue: string | null): string | null {
	if (browser) {
		return window.localStorage.getItem(storageKey);
	}

	return fallbackValue;
}

export function toLocalStorage(storageKey: string, value: string) {
	if (browser) {
		window.localStorage.setItem(storageKey, value);
	}
}
