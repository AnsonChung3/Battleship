<template>
    <div>
         <div v-for="(row, R) in store.activePlayer.grid" :key="R">
            <div class="inline" v-for="(cell, C) in row" :key="C">
                <div
                    @click="prePlace(R, C)"
                    @mouseenter="customMouseEnter(R, C)"
                    @mouseleave="customMouseLeave(R, C)"
                    class="cell"
                    :style="{background: '#'+cellColor(R, C)}"
                >
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useBattleshipStore } from 'stores/battleship.js';
const store = useBattleshipStore();

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
    }
}
function customMouseLeave (R, C) {
    store.removeHover(R, C)
}
</script>
