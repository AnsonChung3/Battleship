<template>
    <div>
        <q-card class="bg-info text-secondary">
            <q-card-section>
                <p>{{ headerText }}</p>
                <progress-q-btn
                    v-for="(ship) in shipsArray" :key=ship.ID
                    class="inline"
                    :label=ship.name
                    :sunkState=ship.isSunk
                    :damageState=ship.isDamaged
                    :shipLength=ship.len
                />
                <div
                    v-if="homePanel"
                    style="margin: 3% 0% 0% 0%"
                >
                    <p>Turn will end
                        <custom-q-btn
                            :label=turnBtnText
                            @click="store.endTurnToggle"
                            style="margin: 0% 1% 0% 0%"
                        />
                        . Click button to change.
                    </p>
                    <p v-if="manualTurn">
                        Click to
                        <custom-q-btn
                            label="end turn"
                            @click="store.nextTurn"
                        />
                    </p>
                </div>
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import ProgressQBtn from 'src/components/ProgressQBtn.vue';
import CustomQBtn from 'src/components/CustomQBtn.vue';

const props = defineProps({
    p1: Boolean
});

import { useBattleshipStore } from 'stores/battleship.js';
const store = useBattleshipStore();
const player = props.p1 ? store.p1 : store.p2;
const shipsArray = player.ships;

const homePanel = computed(() => { return props.p1 === store.p1Active });
const headerText = computed(() => homePanel.value ? 'Your Remaining Fleet' : 'Enemy Destroying Progress');
const turnBtnText = computed(() => player.autoTurn ? 'Automatically' : 'Manually');
const manualTurn = computed(() => { return !player.autoTurn; });
</script>
