<template>
    <div>
        <!-- game panel is created once both players have confirmed placement
        would be on at all times, except showing different info
        for when it's showing as home/opponent panel -->
        <div v-for="(row, R) in gridArray" :key="R">
            <div class="inline" v-for="(cell, C) in row" :key="C">
                <div
                    v-if="homePanel"
                    class="cell"
                    :style="{background: '#'+cellColor(R, C)}"
                >
                </div>
                <!-- cells are only clickable when it's showing as opponent panel -->
                <div
                    v-else
                    @click="isAttackLand(R, C)"
                    class="cell"
                    :style="{background: '#'+cellColor(R, C)}"
                >
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

import { useBattleshipStore } from 'stores/battleship.js';
const store = useBattleshipStore();
const COLORS = store.COLORS;

const props = defineProps({
    // this is a boolean prop hard passed into the component
    // because this game is designed to have 2 players
    // if want to modify in the future to accomodate more players, can change this part
    p1: Boolean
});
const homePanel = computed(() => { return props.p1 === store.p1Active });

const player = props.p1 ? store.p1 : store.p2;
const gridArray = player.grid;

function cellColor (R, C) {
    const cell = gridArray[R][C];
    if (homePanel.value) {
        if (cell.placement === 'PLACED') {
            return cell.isHit ? COLORS.HIT : COLORS.PLACED;
        } else {
            return cell.isHit ? COLORS.MISS : COLORS.BLANK
        }
    } else {
        // else block is for showing opponent's board
        if (!cell.isHit) {
            return COLORS.BLANK;
        }
        return cell.placement === 'PLACED' ? COLORS.HIT : COLORS.MISS
    }
}

function isAttackLand (R, C) {
    const checkCell = gridArray[R][C];
    if (checkCell.isHit) {
        return;
    }
    store.hitCell(R, C)
}
</script>
