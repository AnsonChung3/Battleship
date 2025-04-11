<template>
    <div ref='board'>
         <div v-for="(row, R) in store.activePlayer.grid" :key="R">
            <div class="inline" v-for="(cell, C) in row" :key="C">
                <div
                    @click="prePlace(R, C)"
                    @mouseenter="customMouseEnter(R, C)"
                    @mouseleave="customMouseLeave"
                    class="cell"
                    :style="{background: '#'+cellColor(R, C)}"
                >
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useBattleshipStore } from 'stores/battleship.js';
const store = useBattleshipStore();

const board = ref();
onMounted(() => {
    window.addEventListener('keyup', function (event) {
        if (hoverR.value === undefined && hoverC.value === undefined) { return }
        if (event.keyCode === 82) {
            // key code 82 is key "R"
            store.rotate();
            store.removeHover()
            customMouseEnter(hoverR.value, hoverC.value)
        }
    })
})

const hoverR = ref(undefined);
const hoverC = ref(undefined);

function cellColor (R, C) {
    const cell = store.activePlayer.grid[R][C];
    return store.COLORS[cell.display]
}

function prePlace (R, C) {
    // if cell is occupied or no more ships to be placed, manualPlace will not fire
    if (store.activePlayer.grid[R][C].placement === 'PLACED' || store.activePlayer.ships.every((ship) => ship.isSet)) { return };
    store.manualPlace(R, C)
}

function customMouseEnter (R, C) {
    const cell = store.activePlayer.grid[R][C];
    if (cell.placement !== 'PLACED') {
        store.hoverOverCell(R, C)
        hoverR.value = R;
        hoverC.value = C;
    }
}

function customMouseLeave () {
    store.removeHover();
    hoverR.value = undefined;
    hoverC.value = undefined;
}
</script>
