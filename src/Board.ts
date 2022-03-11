import { PieceColor, getGridFromFEN, Grid, processCastleState, CastleState, Coordinate, convertSquareToCoordinate, Move, Piece, PossibleMoves} from ".";

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

    setMove(color: PieceColor, [from, to]: Move): void {
       let possibleMoves = this.getValidMoves(from);
       // valid move
       if (color === this.turn && possibleMoves.some(( [pRow, pCol] ) => pRow === to[0] && pCol === to[1])) {
           this.grid[to[0]][to[1]] = this.grid[from[0]][from[1]];
           this.grid[from[0]][from[1]] = null;
           this.turn = (this.turn === 'white') ? 'black' : 'white';
       }
    }

    getValidMovesForPlayer(playerColor: PieceColor): PossibleMoves[] {
        let possibleMoves: PossibleMoves[] = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.grid[row][col]?.color === playerColor) {
                    let validMoves = this.getValidMoves([row, col]);
                    if (validMoves.length !== 0) {
                        possibleMoves.push({ currentPosition: [row, col], validMoves: validMoves });
                    }
                }
            }
        }
        return possibleMoves;
    }

    getValidMoves(coord: Coordinate): Coordinate[] {
        const [ row, col ] = coord;
        const currentPiece = this.grid[row][col];
    
        if (currentPiece === null) return [];
    
        return this.moveGenerators(currentPiece, coord);
    }

    private moveGenerators(currentPiece: Piece, coord: Coordinate): Coordinate[] {
        if (currentPiece.type === 'pawn') return this.getPawnMoves(coord);
        if (currentPiece.type === 'bishop') return this.getBishopMoves(coord);
        if (currentPiece.type === 'knight') return this.getKnightMoves(coord);
        if (currentPiece.type === 'rook') return this.getRookMoves(coord);
        if (currentPiece.type === 'queen') return this.getQueenMoves(coord);
        if (currentPiece.type === 'king') return this.getKingMoves(coord);

        return [];
    }
    
    private coordOOB([row, col]: Coordinate): boolean {
        return row < 0 || col < 0 || row > 7 || col > 7;
    }
    
    private getPawnMoves([row, col]: Coordinate): Coordinate[] {
        const currentColor = this.grid[row][col]?.color; 
        let moves: Coordinate[] = [];
        let updateRow: number = 0;
        const colLeft = col - 1;
        const colRight = col + 1;
    
        // check moves for Black piece
        if (currentColor === 'white') {
            // first pawn move 
            if (row === 1) {
                if (this.grid[row + 1][col] === null && this.grid[row + 2][col] === null) moves.push( [row + 2, col] ) 
            }
            updateRow = row + 1;
        }
        // black
        if (currentColor === 'black') {
            // first pawn move 
            if (row === 6) {
                if (this.grid[row - 1][col] === null && this.grid[row - 2][col] === null) moves.push( [row - 2, col]) 
            }
            updateRow = row - 1;
        }
            // check for row out of bound
        if (updateRow >= 0 && updateRow <= 7) {
            // move 1 step forward if its empty square
            if (this.grid[updateRow][col] === null) moves.push([updateRow, col]);
    
            // move to take out enemy pawn
            if (colLeft >= 0 && this.grid[updateRow][colLeft] !== null &&  currentColor !== this.grid[updateRow][colLeft]?.color) moves.push( [updateRow, colLeft] )
    
            // move to take out enemy pawn
            if (colRight <= 7 && this.grid[updateRow][colRight] !== null && currentColor !== this.grid[updateRow][colRight]?.color) moves.push( [updateRow, colRight] )
        }
        return moves;
    }
    
    // cant think of other names lol
    private oneDirection([row, col]: Coordinate, rowDir:number, colDir: number): Coordinate[] {
        let moves: Coordinate[] = [];
        for (let i = 1; i < 8; i++) {
            let [currRow, currCol]: Coordinate = [ row + (i * rowDir), col + (i * colDir) ];
    
            if (this.coordOOB([currRow, currCol])) {
                return moves;
            }
    
            // empty cell
            if (this.grid[currRow][currCol] === null) {
                moves.push([currRow, currCol]);
            }
            // if cell does not have the same color, push the move once and return the moves
            else if (this.grid[currRow][currCol]?.color !== this.grid[row][col]?.color) {
                moves.push([currRow, currCol]);
                return moves;
            }
    
            // blocked by same color piece
            else {
                return moves;
            }
           
        }
        return moves;
    }
    
    private getBishopMoves(coord: Coordinate): Coordinate[] {
        let moves: Coordinate[] = [];
    
        for(const rowDir of [-1, 1]) {
            for(const colDir of [-1, 1]) {
                moves.push(...this.oneDirection(coord, rowDir, colDir));
            }
        }
    
        return moves;
    }
    
    private getKnightMoves([row, col]: Coordinate): Coordinate[] {
        let moves: Coordinate[] = [];
         
        for(const [rowDiff, colDiff] of [[1, 2], [2, 1]]) {
            for(const rowMult of [1, -1]) {
                for(const colMult of [1, -1]) {
                    moves.push( [row + rowDiff * rowMult, col + colDiff * colMult] );
                }
            }
        }
    
        return moves.filter(([currRow, currCol]) => 
            !this.coordOOB([currRow, currCol]) && // the move is inbounds
            this.grid[currRow][currCol]?.color !== this.grid[row][col]?.color // the cell does not have a piece of the same colour
        );
    }
    
    private getRookMoves(coord: Coordinate): Coordinate[] {
        let moves: Coordinate[] = [];
    
        for(const [rowDir, colDir] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            this.coordOOB([rowDir, colDir])
            moves.push(...(this.oneDirection(coord, rowDir, colDir)));
        }

        return moves;
    }
    
    private getQueenMoves(coord: Coordinate): Coordinate[] {
        return [...this.getRookMoves(coord), ...this.getBishopMoves(coord)];
    }
    
    private getKingMoves([row, col]: Coordinate): Coordinate[] {
        let moves: Coordinate[] = [];
        
        for(let rowDiff = -1; rowDiff <= 1; rowDiff++) {
            for(let colDiff = -1; colDiff <= 1; colDiff++) {
                if(rowDiff === 0 && colDiff === 0) continue;
    
                moves.push([row + rowDiff, col + colDiff]);
            }
        }
    
        return moves.filter(([currRow, currCol]) => 
            !this.coordOOB([currRow, currCol]) && // the move is inbounds
            this.grid[currRow][currCol]?.color !== this.grid[row][col]?.color // the cell does not have a piece of the same colour
        );
    }

}