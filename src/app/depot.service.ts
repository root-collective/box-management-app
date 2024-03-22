import { Injectable } from '@angular/core';
import { Depot } from './depot';

@Injectable({
  providedIn: 'root'
})
export class DepotService {
  private readonly _depots = [
    new Depot(1, 'Langenklint', 200),
    new Depot(2, 'Gifhorn', 60),
    new Depot(3, 'Meinersen', 0),
  ];

  constructor() { }

  public get depots() {
    return this._depots;
  }

  public depotsExceptIds(ids: number[]) : Depot[] {
    return this._depots.filter(d => {
      return !ids.find(i => d.id === i);
    });
  }

  public depotById(id: number) : Depot | undefined {
    return this._depots.find(d => d.id === id);
  }

  public transferBoxes(sourceDepotId : number, targetDepotId : number, numberOfBoxes : number) : void {
    const sourceDepot = this.depotById(sourceDepotId);
    const targetDepot = this.depotById(targetDepotId);

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
