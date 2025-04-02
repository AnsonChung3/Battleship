<template>
    <div>
        <q-card class="bg-info text-secondary">
            <q-card-section>
                <p>{{ headerText }}</p>
                <div v-for="(ship) in shipsArray" :key=ship.ID class="inline">
                    <progress-q-btn
                        :label=ship.ID
                        :shipState=ship.isSunk
                        :shipLength=ship.len
                    />
                </div>
                <div
                    v-if="homePanel"
                    style="margin: 3% 0% 0% 0%"
                >
                    <p>Click to toggle end turn method: </p>
                    <custom-q-btn
                        :label=turnBtnText
                        @click="turnToggle"
                        style="margin: 0% 1% 0% 0%"
                    />
                    <custom-q-btn
                        v-if="manualTurn"
                        label="end turn"
                        @click="store.nextTurn"
                    />
                </div>
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup>
import { toRefs, toRef, computed } from 'vue';
import ProgressQBtn from 'src/components/ProgressQBtn.vue';
import CustomQBtn from 'src/components/CustomQBtn.vue';

const props = defineProps({
    p1: Boolean
});
const propP1 = toRef(props, 'p1');

import { useBattleshipStore } from 'stores/battleship.js';
const store = useBattleshipStore();
const player = (propP1.value === true) ? toRefs(store.p1) : toRefs(store.p2);
const shipsArray = player.ships;

const p1Active = toRef(store, 'p1Active');
const homePanel = computed(() => propP1.value === p1Active.value);
const headerText = computed(() => homePanel.value ? 'Your Remaining Fleet' : 'Enemy Destroying Progress');
const turnBtnText = computed(() => player.autoTurn.value ? 'Auto' : 'Manual');
const manualTurn = computed(() => { return !player.autoTurn.value; });

function turnToggle () {
    player.autoTurn.value = !player.autoTurn.value;
}
</script>
