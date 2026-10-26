<script lang="ts" generics="T">
interface Props {
	options: { label: string; value: T }[];
	value: T;
	onchange?: (value: T) => void;
	name?: string;
}

const uid = $props.id();

let {
	options,
	value = $bindable(),
	onchange,
	name = `setting-radio-${uid}`,
}: Props = $props();
</script>

<div class="radio-inputs mt-3">
	{#each options as option}
		<label class="radio">
			<input type="radio" {name} value={option.value} bind:group={value} onchange={() => onchange?.(option.value)} />
			<span class="name">{option.label}</span>
		</label>
	{/each}
</div>

<style>
	.radio-inputs {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		border-radius: var(--radius-large);
		background-color: var(--btn-regular-bg);
		box-sizing: border-box;
		padding: 0.25rem;
		width: 100%;
		font-size: 0.875rem;
		margin-top: 0.75rem;
	}
	.radio-inputs .radio {
		flex: 1 1 0%;
		text-align: center;
		min-width: 0;
	}
	/* Visually hidden but still focusable */
	.radio-inputs .radio input {
		position: absolute;
		opacity: 0;
		width: 1px;
		height: 1px;
		pointer-events: none;
	}
	.radio-inputs .radio input:focus-visible + .name {
		outline: 2px solid var(--primary);
		outline-offset: 2px;
	}
	.radio-inputs .radio .name {
		display: flex;
		cursor: pointer;
		align-items: center;
		justify-content: center;
		border-radius: calc(var(--radius-large) - 0.25rem);
		border: none;
		padding: 0.5rem 0;
		color: var(--btn-content);
		transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out;
		font-weight: 400;
	}
	.radio-inputs .radio input:checked + .name {
		background-color: var(--primary);
		color: white;
		font-weight: 500;
		position: relative;
	}
	.radio-inputs .radio:hover .name {
		background-color: var(--btn-plain-bg-hover);
	}
</style>
