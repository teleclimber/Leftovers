<template>
	<section>
		<label data-fridge>
			<input
				type="radio"
				:checked="!modelValue"
				:value="false"
				@change="updateValue(false)"
			>
			FRIDGE
		</label>
		<label data-freezer>
			<input
				type="radio"
				:checked="modelValue"
				:value="true"
				@change="updateValue(true)"
			>
			FREEZER
		</label>
	</section>
</template>

<script setup lang="ts">
const props = defineProps<{
    modelValue: boolean
}>();
const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>();

function updateValue(value: boolean) {
    emit('update:modelValue', value);
}
</script>

<style scoped>
section {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 0.5rem;
	max-width: 20rem;
}
label {
	padding: 0.2rem 0.5rem;
	background: #def6ff;
	color: #4d849a;
	border: 1px solid #b3e0f1;
	text-align: center;
	position: relative;
}
label:has(:checked) {
	border: 1px solid #1389b4;
}
label[data-fridge] {
	padding-left: 2rem;
}
label[data-fridge]:has(:checked) {
	background: radial-gradient(circle at top right, rgba(124, 216, 252, 1) 0%, rgba(133, 198, 255, 0.3) 50%, rgba(148, 214, 247, 0) 100%);
}
label[data-fridge]:has(:checked)::before {
	content: '💧';
	font-size: 2rem;
	position: absolute;
	bottom: -0.9rem;
	left: 0rem;
}
label[data-freezer] {
	padding-right: 2rem;
}
label[data-freezer]:has(:checked) {
	background: radial-gradient(circle at top left, rgba(124, 216, 252, 1) 0%, rgba(133, 198, 255, 0.3) 50%, rgba(148, 214, 247, 0) 100%);
}
label[data-freezer]:has(:checked)::after {
	content: '❄️';
	font-size: 2rem;
	position: absolute;
	bottom: -0.8rem;
	right: -0.5rem;
}
</style>