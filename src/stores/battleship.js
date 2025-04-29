import { defineStore } from 'pinia';
import { ref, reactive, computed } from 'vue';

export const useBattleshipStore = defineStore('battleship', () => {
    const p1Active = ref(true);
    const p1 = reactive({
        // player property is added for debgging
        // can be removed when whole project is complete
        player: 1,
        placementConfirmed: false,
        autoTurn: true,
        grid: [],
        ships: []
    });
    const p2 = reactive({
        player: 2,
        placementConfirmed: false,
        autoTurn: true,
        grid: [],
        ships: []
    });
    const activePlayer = computed(() => { return p1Active.value ? p1 : p2 });
    const gridWidth = 10;
    const shipLengths = [5, 4, 3, 3, 2, 2, 1, 1];
    const shipNames = {
        1: 'Patrol Boat',
        2: 'Battleship',
        3: 'Destroyer',
        4: 'Submarine',
        5: 'Carrier'
    }
    function generateGrid (player) {
        player.grid = [];
        for (let R = 0; R < gridWidth; R++) {
            const rowArray = [];
            for (let C = 0; C < gridWidth; C++) {
                rowArray.push({
                    coordinate: { R, C },
                    display: 'BLANK',
                    placement: 'BLANK',
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
                name: shipNames[len.toString()],
                isSet: false,
                isSunk: false,
                isDamaged: false
            };
        });
    }
    function initGame () {
        generateShips(p1);
        generateShips(p2);
        generateGrid(p1);
        generateGrid(p2);
    }
    function newGame () {
        p1.placementConfirmed = false;
        p2.placementConfirmed = false;
        initGame();
    }

    // manual placement mode
    function manualPlace (R, C) {
        const ID = manualSelectID.value;
        const goRight = manualGoRight.value;
        const len = activePlayer.value.ships[ID - 1].len;
        if ((goRight && placeRightSuccess(R, C, len)) || (!goRight && placeDownSuccess(R, C, len))) {
            doPlacement(R, C, len, goRight, ID);
            activePlayer.value.ships[ID - 1].isSet = true;
        } else {
            alert('Not enough room!');
        }
    }

    function hoverOverCell (R, C) {
        if (activePlayer.value.ships.every(ship => ship.isSet)) { return };
        const ID = manualSelectID.value;
        const goRight = manualGoRight.value;
        const len = activePlayer.value.ships[ID - 1].len;
        if ((goRight && placeRightSuccess(R, C, len)) || (!goRight && placeDownSuccess(R, C, len))) {
            hoverColoring(R, C, len, goRight, ID);
        }
    }

    function hoverColoring (R, C, len, goRight) {
        for (let i = 0; i < len; i++) {
            if (goRight) {
                activePlayer.value.grid[R][C + i].display = 'HOVER';
            } else {
                activePlayer.value.grid[R + i][C].display = 'HOVER';
            }
        }
    }

    function removeHover () {
        for (let r = 0; r < gridWidth; r++) {
            for (let c = 0; c < gridWidth; c++) {
                activePlayer.value.grid[r][c].display = activePlayer.value.grid[r][c].placement;
            }
        }
    }

    function rotate () {
        manualGoRight.value = !manualGoRight.value;
    }

    // auto placement mode
    function autoPlace () {
        clearPlacement()
        activePlayer.value.ships.forEach((ship) => {
            shipPlacement(ship.len, ship.ID);
            ship.isSet = true;
        });
    }
    function shipPlacement (shipLength, ID) {
        // e.g. startCell = {R: 1, C: 2}
        const startCell = getRndStart(shipLength);
        const R = startCell.R;
        const C = startCell.C;
        if (shipLength === 1) {
            doPlacement(R, C, shipLength, true, ID);
            return;
        }
        const right = startCell.right;
        const down = startCell.down;
        const goRight = !right ? false : (right && down) ? directionRight() : true;
        doPlacement(R, C, shipLength, goRight, ID);
    }
    function getRndStart (shipLength) {
        let R = getRandom(gridWidth);
        let C = getRandom(gridWidth);
        let rndCell = activePlayer.value.grid[R][C];
        let right = placeRightSuccess(R, C, shipLength);
        let down = placeDownSuccess(R, C, shipLength);

        // while (cell is unavailable OR can't be placed in either direction) is true
        // {get a new random start}
        while (rndCell.placement !== 'BLANK' || (!right && !down)) {
            R = getRandom(gridWidth);
            C = getRandom(gridWidth);
            rndCell = activePlayer.value.grid[R][C];
            right = placeRightSuccess(R, C, shipLength);
            down = placeDownSuccess(R, C, shipLength);
        }
        return { R, C, right, down };
    }
    function getRandom (max) {
        return Math.floor(Math.random() * max);
    }
    function directionRight () {
        // rnd when right and down are both viable
        return (Math.random() < 0.5);
    }

    // enums have no need for reactivity
    const COLORS = {
        BLANK: '948C15',
        PLACED: '1F9415',
        HOVER: '4f9749',
        HIT: '921313',
        MISS: '383232'
    };


    // placement method for both Auto and Manual
    function clearPlacement () {
        activePlayer.value.grid.forEach(row => row.forEach(cell => {
            cell.display = 'BLANK';
            cell.placement = 'BLANK';
            cell.ID = 0;
        }));
        activePlayer.value.ships.forEach(ship => { ship.isSet = false; });
    }
    function confirmPlacement () {
        activePlayer.value.placementConfirmed = true;
        p1Active.value = !p1Active.value;
    }
    function doPlacement (R, C, shipLength, goRight, ID) {
        for (let i = 0; i < shipLength; i++) {
            if (goRight) {
                colorShip(R, C + i, ID);
            } else {
                colorShip(R + i, C, ID);
            }
        }
    }
    function placeRightSuccess (R, C, shipLength) {
        for (let len = 1; len < shipLength; len++) {
            const col = C + len;
            if (col >= gridWidth) {
                return false;
            }
            const cell = activePlayer.value.grid[R][col];
            if (cell.placement === 'PLACED') {
                return false;
            }
        }
        return true;
    }
    function placeDownSuccess (R, C, shipLength) {
        for (let len = 1; len < shipLength; len++) {
            const row = R + len;
            if (row >= gridWidth) {
                return false;
            }
            const cell = activePlayer.value.grid[row][C];
            if (cell.placement === 'PLACED') {
                return false;
            }
        }
        return true;
    }
    function colorShip (R, C, ID) {
        activePlayer.value.grid[R][C].display = 'PLACED';
        activePlayer.value.grid[R][C].placement = 'PLACED';
        activePlayer.value.grid[R][C].ID = ID;
    }

    const manualGoRight = ref(true);
    const manualSelectID = computed(() => {
        const firstEmptyShip = activePlayer.value.ships.find((ship) => ship.isSet === false)
        return firstEmptyShip !== undefined ? firstEmptyShip.ID : 999
    });

    const gameEnd = ref(false);

    // game play
    const turnInterval = ref(false);

    function hitCell (R, C) {
        const opponent = p1Active.value ? p2 : p1;
        const checkCell = opponent.grid[R][C]
        checkCell.isHit = true;
        if (checkCell.placement === 'PLACED') {
            opponent.ships[checkCell.ID - 1].isDamaged = true;
            if (isDestroyed(opponent.grid, checkCell.ID)) {
                opponent.ships[checkCell.ID - 1].isSunk = true;
                if (opponent.ships.every(ship => ship.isSunk)) {
                    gameEnd.value = true;
                }
            }
        }
        if (activePlayer.value.autoTurn) {
            setTimeout(() => {
                nextTurn();
            }, 750);
        }
    }

    function isDestroyed (grid, ID) {
        const cells = grid.flat().filter(cell => cell.ID === ID);
        return (cells.every(cell => cell.isHit));
    }

    function endTurnToggle () {
        activePlayer.value.autoTurn = !activePlayer.value.autoTurn;
    }

    function nextTurn () {
        turnInterval.value = !turnInterval.value;
        p1Active.value = !p1Active.value;
    };

    return {
        p1Active,
        p1,
        p2,
        gridWidth,
        initGame,
        newGame,
        autoPlace,
        COLORS,
        manualSelectID,
        manualGoRight,
        gameEnd,
        turnInterval,
        nextTurn,
        manualPlace,
        clearPlacement,
        hoverOverCell,
        removeHover,
        activePlayer,
        confirmPlacement,
        rotate,
        endTurnToggle,
        hitCell
    };
});
