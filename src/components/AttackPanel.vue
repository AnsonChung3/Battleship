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
import { toRef, toRefs, computed } from 'vue';

import { useBattleshipStore } from 'stores/battleship.js';
const store = useBattleshipStore();
const COLORS = store.COLORS;

const p1Active = toRef(store, 'p1Active');
const props = defineProps({
    p1: Boolean
});
const p1 = toRef(props, 'p1');
const homePanel = computed(() => { return (p1.value === p1Active.value); });

const player = p1.value ? toRefs(store.p1) : toRefs(store.p2);
const gridArray = player.grid;
const shipsArray = player.ships;

function cellColor (R, C) {
    const cell = gridArray.value[R][C];
    if (homePanel.value) {
        if (cell.placement === 'PLACED') {
            return cell.isHit ? COLORS.HIT : COLORS.PLACED;
        } else {
            return cell.isHit ? COLORS.MISS : COLORS.BLANK
        }
    } else {
        if (!cell.isHit) {
            return COLORS.BLANK;
        }
        return cell.placement === 'PLACED' ? COLORS.HIT : COLORS.MISS
    }
}

const isAttackAbled = toRef(store, 'isAttackAbled');
function isAttackLand (R, C) {
    const checkCell = gridArray.value[R][C];
    if (!isAttackAbled.value || checkCell.isHit) {
        return;
    }
    isAttackAbled.value = !isAttackAbled.value;
    checkCell.isHit = true;
    if (checkCell.placement === 'PLACED' && isDestroyed(checkCell.ID)) {
        shipsArray.value[checkCell.ID - 1].isSunk = true;
        const isEnd = shipsArray.value.every(ship => ship.isSunk);
        if (isEnd) {
            store.gameEnd = !store.gameEnd;
            return;
        }
    }
    const opponent = !p1.value ? toRefs(store.p1) : toRefs(store.p2);
    if (!homePanel.value && opponent.autoTurn.value) {
        setTimeout(() => {
            store.nextTurn();
        }, 750);
    }
}

function isDestroyed (ID) {
    const cells = gridArray.value.flat().filter(cell => cell.ID === ID);
    return (cells.every(cell => cell.isHit));
}
</script>
