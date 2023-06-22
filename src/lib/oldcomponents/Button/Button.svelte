<script lang="ts" context="module">
	export interface ButtonProps {}
	export enum ButtonStyle {
		None = '',
		Primary = 'primary',
		Secondary = 'secondary',
		Tertiary = 'tertiary',
		Success = 'success',
		// Error = 'error',
		// Warning = 'warning',
		Danger = 'danger',
		Surface = 'surface'
	}
	export enum ButtonSize {
		Small = 'w-16 h-8 xl:w-24',
		Medium = 'w-32',
		Large = 'w-64',
		Full = 'w-full'
	}
</script>

<script lang="ts">
	import './Button.scss';
	export let type: ButtonStyle = ButtonStyle.Primary;
	export let size: ButtonSize = ButtonSize.Medium;
	export let isSubmit: boolean = false;
</script>

<button
	type={isSubmit ? 'submit' : 'button'}
	class={`btn ${size} ` +
		(type != ButtonStyle.None ? `variant-filled-${type}` : `variant-filled`) +
		` ` +
		(type == ButtonStyle.Danger ? `bg-red-600` : ``) +
		(type == ButtonStyle.Success ? `bg-success-800` : ``)}
	><slot />
</button>
