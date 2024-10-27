"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmptyShowSeat = exports.getShowSeatCategory = void 0;
function getShowSeatCategory(screenCat, price) {
    if (screenCat.seats.size === 0)
        return undefined;
    const showSeatMap = new Map();
    for (const [rowName, row] of screenCat.seats) {
        const showSeatRow = row.map(x => ({ col: x, isBooked: false, isTempBooked: false }));
        showSeatMap.set(rowName, showSeatRow);
    }
    return {
        name: screenCat.name,
        price,
        seats: showSeatMap
    };
}
exports.getShowSeatCategory = getShowSeatCategory;
function createEmptyShowSeat(screenSeat, diamond, gold, silver) {
    return {
        diamond: getShowSeatCategory(screenSeat.diamond, diamond),
        gold: getShowSeatCategory(screenSeat.gold, gold),
        silver: getShowSeatCategory(screenSeat.silver, silver)
    };
}
exports.createEmptyShowSeat = createEmptyShowSeat;
