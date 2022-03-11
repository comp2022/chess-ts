import { Move } from "..";
import { Board } from "../Board";

const _defaultBoardState = {"grid":[[{"color":"white","type":"rook"},{"color":"white","type":"knight"},{"color":"white","type":"bishop"},{"color":"white","type":"queen"},{"color":"white","type":"king"},{"color":"white","type":"bishop"},{"color":"white","type":"knight"},{"color":"white","type":"rook"}],[{"color":"white","type":"pawn"},{"color":"white","type":"pawn"},{"color":"white","type":"pawn"},{"color":"white","type":"pawn"},{"color":"white","type":"pawn"},{"color":"white","type":"pawn"},{"color":"white","type":"pawn"},{"color":"white","type":"pawn"}],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[{"color":"black","type":"pawn"},{"color":"black","type":"pawn"},{"color":"black","type":"pawn"},{"color":"black","type":"pawn"},{"color":"black","type":"pawn"},{"color":"black","type":"pawn"},{"color":"black","type":"pawn"},{"color":"black","type":"pawn"}],[{"color":"black","type":"rook"},{"color":"black","type":"knight"},{"color":"black","type":"bishop"},{"color":"black","type":"queen"},{"color":"black","type":"king"},{"color":"black","type":"bishop"},{"color":"black","type":"knight"},{"color":"black","type":"rook"}]]};

describe("Board", () => {

    let board: Board;
    
    // code to  run before each test
    beforeEach(() => {
        board = new Board();
    });

    it('initialises', () => {
        expect(board).toBeTruthy();
        expect(board.grid).toBeTruthy();
    });

    it('initialses with default state', () => {

        expect(board.grid).toEqual(_defaultBoardState.grid);
    });

    it('test move', () => {
        let [from, to]: Move =  [ [1, 4], [3, 4] ];

        board.setMove('white', [from, to]);
        expect(board.grid[from[0]][from[1]]).toBe(null);
        expect(board.grid[to[0]][to[1]]).toEqual({"color":"white","type":"pawn"});
        console.log(board.getValidMovesForPlayer('white'));
    });

    it.todo('defeats Magnus Carlsen');
    
});