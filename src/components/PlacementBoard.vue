<template>
    <div>
         <div v-for="(row, R) in gridArray" :key="R">
            <div class="inline" v-for="(cell, C) in row" :key="C">
                <div
                    @click="manualPlace(R, C)"
                    class="cell"
                    :style="{background: '#'+cellColor(R, C)}"
                >
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { toRef, toRefs } from 'vue';
import { manualPlace } from 'components/helpers.js';

import { useBattleshipStore } from 'stores/battleship.js';
const store = useBattleshipStore();
const STATES = store.STATES;
const COLORS = store.COLORS;

const p1Active = toRef(store, 'p1Active');
const player = p1Active.value ? toRefs(store.p1) : toRefs(store.p2);
const gridArray = player.grid;

// this function has the same name as the one in AttackPanel
// because they were from the same function
// keeping the same name 1. they are in different component
// 2. no need to change template code
function cellColor (R, C) {
    const cell = player.grid.value[R][C];
    if (cell.placement === STATES.PLACED) {
        return COLORS.HIT;
    }
    if (cell.placement === STATES.MARGIN) {
        return COLORS.MARGIN;
    } else {
        return COLORS.BLANK;
    }
}
</script>
