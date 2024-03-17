export class Depot {
    public readonly _id: number;
    public readonly _name: string;
    private _numberOfBoxes: number;

    constructor(id: number, name: string, numberOfBoxes: number = 0) {
        this._id = id;
        this._name = name;
        this._numberOfBoxes = numberOfBoxes;
    }

    public get id() {
        return this._id;
    }

    public get name() {
        return this._name;
    }

    public get numberOfBoxes() {
        return this._numberOfBoxes;
    }

    public set numberOfBoxes(newNumberOfBoxes : number) {
        if (newNumberOfBoxes < 0) {
            throw new Error('Number of boxes must be greater or equal 0.');
        }

        this._numberOfBoxes = newNumberOfBoxes;
    }
}
