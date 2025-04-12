<template>
    <div>
        <q-card class="bg-info text-secondary">
            <q-card-section>
                <p>{{ headerText }}</p>
                <div v-for="(ship) in shipsArray" :key=ship.ID class="inline">
                    <progress-q-btn
                        :label=ship.name
                        :shipState=ship.isSunk
                        :shipLength=ship.len
                    />
                </div>
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
import { toRefs, computed } from 'vue';
import ProgressQBtn from 'src/components/ProgressQBtn.vue';
import CustomQBtn from 'src/components/CustomQBtn.vue';

const props = defineProps({
    p1: Boolean
});

import { useBattleshipStore } from 'stores/battleship.js';
const store = useBattleshipStore();
// toRefs() is used here to "create a ref for a property on a source reactive object"
// so "mutating the source property will update the ref" for all the computed properties below
const player = toRefs(props.p1 ? store.p1 : store.p2);
const shipsArray = player.ships;

const homePanel = computed(() => player.player.value === store.activePlayer.player);
const headerText = computed(() => homePanel.value ? 'Your Remaining Fleet' : 'Enemy Destroying Progress');
const turnBtnText = computed(() => player.autoTurn.value ? 'Automatically' : 'Manually');
const manualTurn = computed(() => { return !player.autoTurn.value; });
</script>
