<template>
    <div>
        <div class="placement-panel bg-info text-secondary">
            <p>Pick the size of ship you want to place</p>
            <custom-q-btn
                v-for="(ship) in shipsArray" :key="ship.ID"
                @click="shipSelect(ship.ID)"
                :label=ship.name
                :disabled="ship.isSet"
                class="buttonRow"
            />
            <p>
                Click to rotate:
                <custom-q-btn
                    @click="rotate"
                    :label=directionDisplay
                    class="buttonRow"
                />
            </p>
            <p>Alternatively, you can click to
                <custom-q-btn
                    @click="autoPlace"
                    label="Place all"
                    :disabled=isFullPlacement
                />
            </p>

        </div>
        <div>
            <custom-q-btn
                @click="clearPlacement"
                label="Clear Placement"
                style="margin-right: 1%"
            />
            <custom-q-btn
                :disabled=!isFullPlacement
                @click="confirmPlacement"
                label="Confirm Placement"
                style="margin-right: 1%"
            />
        </div>
        <placement-board/>
    </div>
</template>

<script setup>
import { ref, watch, computed, toRef, toRefs } from 'vue';
import CustomQBtn from 'src/components/CustomQBtn.vue';
import PlacementBoard from 'components/PlacementBoard.vue';
import { autoPlace, resetSelectedID } from 'components/helpers.js';

import { useBattleshipStore } from 'stores/battleship.js';
const store = useBattleshipStore();
const STATES = store.STATES;

const p1Active = toRef(store, 'p1Active');
const player = p1Active.value ? toRefs(store.p1) : toRefs(store.p2);
const gridArray = player.grid;
const shipsArray = player.ships;

const tab = ref('auto');
watch(tab, (newtab) => {
    clearPlacement();
});

const directionDisplay = computed(() => store.manualGoRight ? 'Right' : 'Down');
function rotate () {
    store.manualGoRight = !store.manualGoRight;
};
function shipSelect (ID) {
    store.manualSelectID = ID;
};

const isFullPlacement = computed(() => shipsArray.value.every((ship) => ship.isSet));
function clearPlacement () {
    gridArray.value.forEach(row => row.forEach(cell => {
        cell.display = STATES.BLANK;
        cell.placement = STATES.BLANK;
        cell.ID = 0;
    }));
    shipsArray.value.forEach(ship => { ship.isSet = false; });
    resetSelectedID();
}
function confirmPlacement () {
    player.placementConfirmed.value = true;
    p1Active.value = !p1Active.value;
    resetSelectedID();
}
</script>

<style scoped>
.placement-panel {
    padding: 2%
}
</style>

