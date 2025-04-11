<template>
    <div>
        <div class="placement-panel bg-info text-secondary">
            <p>Pick the size of ship you want to place</p>
            <custom-q-btn
                v-for="(ship) in store.activePlayer.ships" :key="ship.ID"
                :label=ship.name
                :disabled="ship.isSet"
                class="buttonRow"
                :color="selectedBtnBkg(ship.ID)"
            />
            <p>
                Current placement direction is
                <custom-q-btn
                    @click="store.rotate"
                    :label=directionDisplay
                    class="buttonRow"
                />
                . Click to change.
            </p>
            <p>Alternatively, you can click to
                <custom-q-btn
                    @click="store.autoPlace"
                    label="Place all"
                />
            </p>
        </div>
        <div>
            <custom-q-btn
                @click="store.clearPlacement"
                label="Clear Placement"
            />
            <custom-q-btn
                :disabled=!isFullPlacement
                @click="store.confirmPlacement"
                label="Confirm Placement"
            />
        </div>
        <placement-board/>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import CustomQBtn from 'src/components/CustomQBtn.vue';
import PlacementBoard from 'components/PlacementBoard.vue';

import { useBattleshipStore } from 'stores/battleship.js';
const store = useBattleshipStore();

function selectedBtnBkg (id) {
    return id === store.manualSelectID ? 'accent' : 'primary';
};

const directionDisplay = computed(() => store.manualGoRight ? 'Right' : 'Down');

const isFullPlacement = computed(() => store.activePlayer.ships.every((ship) => ship.isSet));

</script>

<style scoped>
.placement-panel {
    padding: 2%
}
</style>
