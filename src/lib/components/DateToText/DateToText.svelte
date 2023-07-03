<script lang="ts" context="module">
	export interface DateToTextProps {}
	export enum DateToTextType {
		Year = 'year',
		Month = 'month',
		Day = 'day'
	}
</script>

<script lang="ts">
	import './DateToText.scss';
	export let startDate: Date;
	export let endDate: Date;
	let dateType = DateToTextType.Day;
	let difference = startDate.getTime() - endDate.getTime();
	// Convert to days
	difference = Math.floor(difference / (1000 * 60 * 60 * 24));
	// if difference is greater than 31 days, then it's a month
	if (Math.abs(difference) >= 31) {
		difference = Math.floor(difference / 31);
		dateType = DateToTextType.Month;
	}
	// if difference is greater than 12 months, then it's a year
	if (dateType === DateToTextType.Month && Math.abs(difference) >= 12) {
		difference = Math.floor(difference / 12);
		dateType = DateToTextType.Year;
	}
</script>

{#if difference < 0}
	<div class="text-success-500">
		{Math.abs(difference)}
		{#if dateType === DateToTextType.Day}
			{#if Math.abs(difference) === 1}jour{:else}jours{/if}
		{:else if dateType === DateToTextType.Month}
			mois
		{:else if dateType === DateToTextType.Year}
			{#if Math.abs(difference) === 1}année{:else}années{/if}
		{/if}
		restant
	</div>
{:else if difference > 0}
	<div class="text-error-500">
		{Math.abs(difference)}
		{#if dateType === DateToTextType.Day}
			{#if Math.abs(difference) === 1}jour{:else}jours{/if}
		{:else if dateType === DateToTextType.Month}
			mois
		{:else if dateType === DateToTextType.Year}
			{#if Math.abs(difference) === 1}année{:else}années{/if}
		{/if}
		de retard
	</div>
{:else}
	<div class="text-warning-500">Aujourd'hui</div>
{/if}
<div />
