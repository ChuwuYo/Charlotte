<script lang="ts">
export let options: { label: string; value: any }[] = [];
export let value: any;
export let name: string =
	"setting-radio-" + Math.random().toString(36).substr(2, 9);

function handleChange(v: any) {
	value = v;
}
</script>

<div class="radio-inputs mt-3">
	{#each options as option}
		<label class="radio">
			<input 
				type="radio" 
				{name} 
				value={option.value} 
				checked={value === option.value} 
				on:change={() => handleChange(option.value)}
			>
			<span class="name">{option.label}</span>
		</label>
	{/each}
</div>

<style lang="stylus">
	.radio-inputs
		position relative
		display flex
		flex-wrap wrap
		border-radius var(--radius-large)
		background-color var(--btn-regular-bg)
		box-sizing border-box
		padding 0.25rem
		width 100%
		font-size 0.875rem
		margin-top 0.75rem

	.radio-inputs .radio
		flex 1 1 0%
		text-align center
		min-width 0

	.radio-inputs .radio input
		display none

	.radio-inputs .radio .name
		display flex
		cursor pointer
		align-items center
		justify-content center
		border-radius calc(var(--radius-large) - 0.25rem)
		border none
		padding 0.5rem 0
		color var(--btn-content)
		transition all 0.15s ease-in-out
		font-weight 400

	.radio-inputs .radio input:checked + .name
		background-color var(--primary)
		color white
		font-weight 500
		position relative

	.radio-inputs .radio:hover .name
		background-color var(--btn-plain-bg-hover)
</style>
