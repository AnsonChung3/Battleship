<template>
    <div>
         <div v-for="(row, R) in player.grid.value" :key="R">
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
import { toRefs } from 'vue';

import { useBattleshipStore } from 'stores/battleship.js';
const store = useBattleshipStore();

const player = toRefs(store.activePlayer);

// this function has the same name as the one in AttackPanel
// because they were from the same function
// keeping the same name 1. they are in different component
// 2. no need to change template code
function cellColor (R, C) {
    const cell = player.grid.value[R][C];
    return store.COLORS[cell.display]
}

function prePlace (R, C) {
    // if cell is occupied or no more ships to be placed, manualPlace will not fire
    if (player.grid.value[R][C].placement === 'PLACED' || player.ships.value.every((ship) => ship.isSet)) { return };
    store.manualPlace(R, C)
}

function customMouseEnter (R, C) {
    const cell = player.grid.value[R][C];
    if (cell.placement !== 'PLACED') {
        store.hoverOverCell(R, C)
    }
}
function customMouseLeave (R, C) {
    store.removeHover(R, C)
}
</script>
