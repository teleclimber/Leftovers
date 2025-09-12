<script setup lang="ts">
import { watch, ref, Ref, computed } from 'vue';

const props = defineProps<{
	modelValue: number,	// this is in days.
	freezer: boolean
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: number): void
}>();

const fridge_days = ref(5);
const freezer_months = ref(3);

watch( () => props.modelValue, () => {
	if( props.freezer ) {
		freezer_months.value = Math.max(1, Math.round( props.modelValue / 30 ));
	}
	else {
		fridge_days.value = props.modelValue;
	}
}, { immediate: true });

const days_to_spoil = computed( () => {
	if( props.freezer ) {
		return freezer_months.value * 30;
	}
	else {
		return Number(fridge_days.value);
	}
});

watch( days_to_spoil, () => {
	emit('update:modelValue', days_to_spoil.value);
}, { immediate: true });

</script>

<template>
	<input v-if="freezer" v-model="freezer_months" class="w-full" type="range" id="spoils-in-input" name="days" min="1" max="12" step="1" />
	<input v-else v-model="fridge_days" class="w-full" type="range" id="spoils-in-input" name="days" min="1" max="15" step="1" />
</template>