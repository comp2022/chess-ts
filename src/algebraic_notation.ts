import { PieceType, Grid, Piece, GridValue, CastleState, Coordinate } from ".";

const sanToPieceType: Record<string, PieceType> = {
    'p': 'pawn',
    'n': 'knight',
    'b': 'bishop',
    'r': 'rook',
    'q': 'queen',
    'k': 'king'
};

export const rankLabels = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const fileLabels = ['1', '2', '3', '4', '5', '6', '7', '8'];

export function sanToPiece(san: string): Piece {
    // uppercase means white, lowercase means black
    const color = san === san.toUpperCase() ? 'white' : 'black';
                
    // force lowercase to check piece type
    san = san.toLowerCase();
    const type = sanToPieceType[san];

    return { color, type };
}

// used to be convertFENToBoard
export function getGridFromFEN(fen: string): Grid {
    const [gridState, turn, castleState, epSquare, halfmoveClock, fullMoveNumber] = fen.split(" ");

    const ranks = gridState.split("/");
    
    const grid = ranks.map((rankState, rankIndex) => {
        const rank: GridValue[] = [...Array(8)].map(_ => null); // null by default

        let col = 0;
        // standard algebraic notation, not actually SAN but best-fitting
        for(let san of rankState.split("")) {
            if(col >= 8) throw new Error(`Invalid FEN: Too many cells described for rank ${rankIndex}.`);

            // check if its describing an amount of empty places
            const val = Number.parseInt(san);
            if(!isNaN(val)) {
                col += val; // advance by the specified number of cells
                continue;
            }

            // otherwise it describes a piece
            rank[col] = sanToPiece(san);

            col++;
        }

        return rank;
    });

    // the first rank described in FEN is actually the black side, so we need to reverse it to make sure white is first
    grid.reverse();

    return grid;
}

export function processCastleState(castleState: string): CastleState {
    return {
        black: {
            kingside: castleState.includes('k'),
            queenside: castleState.includes('q'),
        },
        white: {
            kingside: castleState.includes('K'),
            queenside: castleState.includes('Q'),
        }
    }
}

// a1 is 0, 0
export function convertCoordinateToSquare([row, col]: Coordinate): string {
    return `${rankLabels[row]}${fileLabels[col]}`;
}

export function convertSquareToCoordinate(square: string): Coordinate {
    const [rank, file] = square.split("");
    return [
        rankLabels.indexOf(rank),
        fileLabels.indexOf(file)
    ]
}