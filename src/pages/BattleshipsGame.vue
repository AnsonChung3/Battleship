<template>
    <div>
        <div class="GameEndModal">
            <q-dialog v-model="store.gameEnd" persistent>
                <q-card class="bg-info text-secondary">
                    <q-card-section>
                        <h1>{{ turnPlayer }} won!</h1>
                        <h1> Game End!</h1>
                    </q-card-section>
                    <q-card-actions align="center">
                        <q-btn
                            label="start new"
                            @click="store.newGame"
                            v-close-popup
                            outline
                        />
                    </q-card-actions>
                </q-card>
            </q-dialog>
        </div>
        <div>
            <h1>Battleships</h1>
        </div>
        <div
            v-show="store.turnInterval"
            ref='customInterval'
        >
            <h1>{{ turnPlayer }} ready?</h1>
            <p>
                Click button to go
            <custom-q-btn
                label="next turn"
                @click="store.turnInterval = !store.turnInterval"
            />
            . Or press 'Enter'.
            </p>
        </div>
        <div v-show="!store.turnInterval">
            <div v-if="!store.p1.placementConfirmed" class="row">
                <placement-header class="panels col" />
                <div class="panels col"> <h2>Player 1 please choose fleet placement</h2> </div>
            </div>
            <div v-else-if="!store.p2.placementConfirmed" class="row">
                <div class="panels col"> <h2>Player 2 please choose fleet placement</h2> </div>
                <placement-header class="panels col" />
            </div>
            <div v-else>
                <h2>{{ turnPlayer }}'s turn</h2>
                <div class="row">
                    <div class="panels col">
                        <attack-header :p1=true />
                        <attack-panel :p1=isPlayerOne />
                    </div>
                    <div class="panels col">
                        <attack-header :p1=false />
                        <attack-panel :p1=!isPlayerOne />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import PlacementHeader from 'components/PlacementHeader.vue';
import AttackHeader from 'components/AttackHeader.vue';
import AttackPanel from 'components/AttackPanel.vue';
import CustomQBtn from 'components/CustomQBtn.vue';

import { useBattleshipStore } from 'stores/battleship.js';
const store = useBattleshipStore();
store.initGame();

const isPlayerOne = true;
const turnPlayer = computed(() => store.p1Active ? 'Player 1' : 'Player 2');

const customInterval = ref();
onMounted(() => {
    window.addEventListener('keyup', function (event) {
        if (!store.turnInterval) { return }
        if (event.keyCode === 13) {
            // key code 13 is key "enter"
            store.turnInterval = !store.turnInterval
        }
    })
})
</script>

<style>
.inline {
  display: inline-block;
}
.buttonRow {
    margin-bottom: 2%
}
.cell {
    background: #CA7070;
    width: 40px;
    height: 40px;
    border: 1px solid #D4D4D4;
    margin: -10% -10% -10% 0%
}
.panels {
    padding: 0% 1% 0% 1%
}
</style>
