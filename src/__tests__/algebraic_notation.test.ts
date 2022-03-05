import { convertCoordinateToSquare, processCastleState } from "..";

describe("Algebraic Notation", () => {

    it('castle state kqKQ', () => {
        const castleState = processCastleState('kqKQ');

        expect(castleState.black.kingside).toBe(true);
        expect(castleState.black.queenside).toBe(true);
        expect(castleState.white.kingside).toBe(true);
        expect(castleState.white.queenside).toBe(true);
    });

    it('castle state kK', () => {
        const castleState = processCastleState('kK');

        expect(castleState.black.kingside).toBe(true);
        expect(castleState.black.queenside).toBe(false);
        expect(castleState.white.kingside).toBe(true);
        expect(castleState.white.queenside).toBe(false);
    });

    it('castle state -', () => {
        const castleState = processCastleState('-');

        expect(castleState.black.kingside).toBe(false);
        expect(castleState.black.queenside).toBe(false);
        expect(castleState.white.kingside).toBe(false);
        expect(castleState.white.queenside).toBe(false);
    });

    it('castle state qk', () => {
        const castleState = processCastleState('qk');

        expect(castleState.black.kingside).toBe(true);
        expect(castleState.black.queenside).toBe(true);
        expect(castleState.white.kingside).toBe(false);
        expect(castleState.white.queenside).toBe(false);
    });

    it('castle state K', () => {
        const castleState = processCastleState('K');

        expect(castleState.black.kingside).toBe(false);
        expect(castleState.black.queenside).toBe(false);
        expect(castleState.white.kingside).toBe(true);
        expect(castleState.white.queenside).toBe(false);
    });

    it('converts coordinate to square', () => {
        
    })
});

describe("Coordinate-Square conversion", () => {

    it('[0, 0]', () => {
        const s = convertCoordinateToSquare([0, 0]);

        expect(s).toEqual("a1");
    });
});