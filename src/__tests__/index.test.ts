import { hi } from "..";

describe("My tests", () => {
    it("works", () => {
        expect(1).toBe(1);
    });

    it("interfaces with project", () => {
        const res = hi();
        expect(res).toEqual('Hii');
    })

    it.todo("gets me rich quick");
});