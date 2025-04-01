import { useBattleshipStore } from 'stores/battleship.js';
const store = useBattleshipStore();
const WIDTH = store.gridWidth;
let activePlayer = store.p1Active ? store.p1 : store.p2;

// game play
export function nextTurn () {
    store.turnInterval = !store.turnInterval;
    store.p1Active = !store.p1Active;
    store.isAttackAbled = !store.isAttackAbled;
};

// manual placement mode
export function manualPlace (R, C) {
    activePlayer = store.p1Active ? store.p1 : store.p2;
    const ID = store.manualSelectID;
    const goRight = store.manualGoRight;
    if (ID === 999) {
        alert('no ship is selected');
        return;
    }
    if (activePlayer.grid[R][C].placement !== 'BLANK') {
        alert('invalid placement');
        return;
    }
    const len = activePlayer.ships[ID - 1].len;
    if ((goRight && placeRightSuccess(R, C, len)) || (!goRight && placeDownSuccess(R, C, len))) {
        doPlacement(R, C, len, goRight, ID);
        activePlayer.ships[ID - 1].isSet = true;
        resetSelectedID();
    } else {
        alert('Not enough room!');
    }
}

// auto placement mode
export function autoPlace () {
    // active player needs to be refreshed at the beginning of the placement
    activePlayer = store.p1Active ? store.p1 : store.p2;
    activePlayer.ships.forEach((ship) => {
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
    let R = getRandom(WIDTH);
    let C = getRandom(WIDTH);
    let rndCell = activePlayer.grid[R][C];
    let right = placeRightSuccess(R, C, shipLength);
    let down = placeDownSuccess(R, C, shipLength);

    // while (cell is unavailable OR can't be placed in either direction) is true
    // {get a new random start}
    while (rndCell.placement !== 'BLANK' || (!right && !down)) {
        R = getRandom(WIDTH);
        C = getRandom(WIDTH);
        rndCell = activePlayer.grid[R][C];
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

// placement method for both Auto and Manual
export function resetSelectedID () {
    store.manualSelectID = 999;
};
function doPlacement (R, C, shipLength, goRight, ID) {
    for (let i = 0; i < shipLength; i++) {
        if (goRight) {
            colorShip(R, C + i, ID);
            // color left/right end of ship once
            // if (i === 0) {
            //     // left end, top, bottm
            //     if (C >= 1) {
            //         colorMargin(R, C - 1);
            //         if (R >= 1) {
            //             colorMargin(R - 1, C - 1);
            //         }
            //         if (R + 1 < WIDTH) {
            //             colorMargin(R + 1, C - 1);
            //         }
            //     }
            //     // right end, top, bottm
            //     if (C + shipLength < WIDTH) {
            //         colorMargin(R, C + shipLength);
            //         if (R >= 1) {
            //             colorMargin(R - 1, C + shipLength);
            //         }
            //         if (R + 1 < WIDTH) {
            //             colorMargin(R + 1, C + shipLength);
            //         }
            //     }
            // }
            // // if the row above exist, color cell above
            // if (R >= 1) {
            //     colorMargin(R - 1, C + i);
            // }
            // // if bottom row existm coloe cell below
            // if (R + 1 < WIDTH) {
            //     colorMargin(R + 1, C + i);
            // }
        } else {
            colorShip(R + i, C, ID);
            // color top/bottom ends once
            // if (i === 0) {
            //     // top end, left, right
            //     if (R >= 1) {
            //         colorMargin(R - 1, C);
            //         if (C >= 1) {
            //             colorMargin(R - 1, C - 1);
            //         }
            //         if (C + 1 < WIDTH) {
            //             colorMargin(R - 1, C + 1);
            //         }
            //     }
            //     // bottom end, left, right
            //     if (R + shipLength < WIDTH) {
            //         colorMargin(R + shipLength, C);
            //         if (C >= 1) {
            //             colorMargin(R + shipLength, C - 1);
            //         }
            //         if (C + 1 < WIDTH) {
            //             colorMargin(R + shipLength, C + 1);
            //         }
            //     }
            // }
            // // left col
            // if (C >= 1) {
            //     colorMargin(R + i, C - 1);
            // }
            // // right col
            // if (C + 1 < WIDTH) {
            //     colorMargin(R + i, C + 1);
            // }
        }
    }
}
function placeRightSuccess (R, C, shipLength) {
    for (let len = 1; len < shipLength; len++) {
        const col = C + len;
        if (col >= WIDTH) {
            return false;
        }
        const cell = activePlayer.grid[R][col];
        if (cell.placement === 'PLACED') {
            return false;
        }
    }
    return true;
}
function placeDownSuccess (R, C, shipLength) {
    for (let len = 1; len < shipLength; len++) {
        const row = R + len;
        if (row >= WIDTH) {
            return false;
        }
        const cell = activePlayer.grid[row][C];
        if (cell.placement === 'PLACED') {
            return false;
        }
    }
    return true;
}
function colorShip (R, C, ID) {
    activePlayer.grid[R][C].display = 'PLACED';
    activePlayer.grid[R][C].placement = 'PLACED';
    activePlayer.grid[R][C].ID = ID;
}
// function colorMargin (R, C) {
//     activePlayer.grid[R][C].display = STATES.MARGIN;
//     activePlayer.grid[R][C].placement = STATES.MARGIN;
// }

export function newGame () {
    store.p1.placementConfirmed = false;
    store.p2.placementConfirmed = false;
    store.initGame();
}
