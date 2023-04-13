import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';

export const useBattleshipStore = defineStore('battleship', () => {
    const p1Active = ref(true);
    const p1 = reactive({
        // player property is added for debgging
        // can be removed when whole project is complete
        player: 1,
        placementConfirmed: false,
        grid: [],
        ships: []
    });
    const p2 = reactive({
        player: 2,
        placementConfirmed: false,
        grid: [],
        ships: []
    });

    const gridWidth = 10;
    const shipLengths = [5, 4, 3, 3, 2, 2, 1, 1];

    function generateGrid (player) {
        player.grid = [];
        for (let R = 0; R < gridWidth; R++) {
            const rowArray = [];
            for (let C = 0; C < gridWidth; C++) {
                rowArray.push({
                    // coordinate is only for debugging
                    // can be removed when whole project is complete
                    coordinate: `row ${R}, column ${C}`,
                    display: STATES.BLANK,
                    placement: STATES.BLANK,
                    ID: 0,
                    isHit: false
                });
            }
            player.grid.push(rowArray);
        }
    }
    function generateShips (player) {
        player.ships = shipLengths.map((len, index) => {
            return {
                len,
                ID: index + 1,
                isSet: false,
                isSunk: false
            };
        });
    }
    function initGame () {
        generateShips(p1);
        generateShips(p2);
        generateGrid(p1);
        generateGrid(p2);
    }

    // these 2 enums have no need for reactivity
    const STATES = {
        BLANK: 0,
        PLACED: 1,
        MARGIN: 2,
        HIT: 3,
        MISS: 4
    };
    const COLORS = {
        BLANK: '948C15',
        PLACED: '1F9415',
        MARGIN: '13468C',
        HIT: '921313',
        MISS: '383232'
    };

    const manualGoRight = ref(true);
    const manualSelectID = ref(999);

    const gameEnd = ref(false);
    const turnInterval = ref(false);
    const isAttackAbled = ref(true);

    return {
        p1Active,
        p1,
        p2,
        gridWidth,
        initGame,
        STATES,
        COLORS,
        manualSelectID,
        manualGoRight,
        gameEnd,
        turnInterval,
        isAttackAbled
    };
});
