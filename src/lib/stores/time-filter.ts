import { writable } from 'svelte/store';

const _timeFilter: { low: Date; high: Date; useFilter: boolean } = {
	low: new Date(),
	high: new Date(),
	useFilter: false
};

export const timeFilter = writable(_timeFilter);
