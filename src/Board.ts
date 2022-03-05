import { PieceColor, getGridFromFEN, Grid, processCastleState, CastleState, Coordinate, convertSquareToCoordinate } from ".";

export class Board {
    grid: Grid;
    turn: PieceColor;
    castleStates: CastleState;
    epSquare: Coordinate | null; // en passant square
    halfmoveClock: number;
    fullmoveNumber: number;

    // No error checking / input validation anywhere
    constructor(initialState: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") {
        const [gridState, turn, castleState, epSquare, halfmoveClock, fullmoveNumber] = initialState.split(" ");

        this.grid = getGridFromFEN(gridState);
        this.turn = turn === 'w' ? 'white' : 'black';
        this.castleStates = processCastleState(castleState);
        this.epSquare = epSquare === '-' ? null : convertSquareToCoordinate(epSquare);
        this.halfmoveClock = Number.parseInt(halfmoveClock);
        this.fullmoveNumber = Number.parseInt(fullmoveNumber);
    }

    
}