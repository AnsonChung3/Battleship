<template>
    <q-btn
        class="custom-btn"
        :text-color=textCompu
        :color=colorCompu
    >
        <q-tooltip
            anchor="top middle"
            self="top middle"
            :offset="[30, 30]"
        >{{ shipLength }} tile</q-tooltip>
    </q-btn>
</template>

<script setup>
import { computed, toRef } from 'vue';
const props = defineProps({
    sunkState: Boolean,
    damageState: Boolean,
    shipLength: Number
});

const sunkState = toRef(props, 'sunkState')
const damageState = toRef(props, 'damageState')

const colorCompu = computed(() => {
    if (damageState.value) {
        return sunkState.value ? 'secondary' : 'accent';
    }
    return 'primary';
});
const textCompu = computed(() => sunkState.value ? 'warning' : 'secondary');
</script>
