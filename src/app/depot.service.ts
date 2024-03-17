import { Injectable } from '@angular/core';
import { Depot } from './depot';

@Injectable({
  providedIn: 'root'
})
export class DepotService {
  private readonly _depots = [
    new Depot(1, 'Langenklint', 200),
    new Depot(2, 'Gifhorn', 0),
    new Depot(3, 'Meinersen', 0),
  ];

  constructor() { }

  public get depots() {
    return this._depots;
  }

  public transferBoxes(sourceDepotId : number, targetDepotId : number, numberOfBoxes : number) {
    let sourceDepot = this._depots.find(d => d.id === sourceDepotId);
    let targetDepot = this._depots.find(d => d.id === targetDepotId);

    if (sourceDepot === null) {
      throw new Error('Source depot not found');
    }

    if (targetDepot === null) {
      throw new Error('Target depot not found');
    }

    if (sourceDepot!.numberOfBoxes < numberOfBoxes) {
      throw new Error(`${numberOfBoxes} exceeds the number of available boxes in the source.`);
    }

    sourceDepot!.numberOfBoxes -= numberOfBoxes;
    targetDepot!.numberOfBoxes += numberOfBoxes;
  }
}
