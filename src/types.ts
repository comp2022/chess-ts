export type PieceType = 'pawn' | 'bishop' | 'knight' | 'rook' | 'queen' | 'king'; 

export type PieceColor = 'white' | 'black';

export interface Piece {
  color: PieceColor;
  type: PieceType;
};

export type GridValue = (Piece | null);

export type Grid = GridValue[][];

export interface CastleState { 
  black: {
    kingside: boolean;
    queenside: boolean;
  };
  white: {
    kingside: boolean;
    queenside: boolean;
  };
}

export type Coordinate = [ row: number, col: number ];

export type Move = [from: Coordinate, to: Coordinate];

export interface PossibleMoves {
  currentPosition: Coordinate,
  validMoves: Coordinate[]
}

export type FEN = string;
