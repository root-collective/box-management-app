import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Depot } from './depot';
import { environment } from '../environments/environment';
import { catchError } from 'rxjs/operators';

export interface Station {
  name: string,
  location: string,
  id: number
}

export interface StationWithBoxEstimate extends Station {
  estimate_boxes: number;
}

export interface SetInventoryRequest {
  station: number,
  num_boxes: number,
  notes: string
}

export interface Inventory extends SetInventoryRequest {
  id: number,
  timestamp: Date
}

const stationsApiUrl = new URL('/boxmanagement/station/', environment.apiUrl);
const inventoryApiUrl = new URL('/boxmanagement/inventory/', environment.apiUrl);

@Injectable({
  providedIn: 'root'
})
export class DepotService {
  private _depots : Depot[] = [];

  constructor(private http: HttpClient) {
    this.loadDepots(http);
  }

  private loadDepots(http: HttpClient) {
    this._depots = [];

    http.get<Station[]>(stationsApiUrl.href)
        .subscribe(stations => {
          stations.forEach(station => {
            http.get<StationWithBoxEstimate>((new URL(station.id.toString(), stationsApiUrl)).href)
              .subscribe(station => {
                const depot = new Depot(station.id, station.name, station.estimate_boxes);
                this._depots.push(depot);
                console.log(`Loaded depot with following properties: ${station.id} - ${station.name} - ${station.estimate_boxes}`);
              });
          });
          console.log(`Loaded ${this._depots.length} depots.`);
        });
  }

  public get depots() : readonly Depot[] {
    return this._depots;
  }

  public depotsExceptIds(ids: number[]) : readonly Depot[] {
    return this._depots.filter(d => {
      return !ids.find(i => d.id === i);
    });
  }

  public depotById(id: number) : Depot | undefined {
    return this._depots.find(d => d.id === id);
  }

  public transferBoxes(sourceDepotId: number, targetDepotId: number, numberOfBoxes: number) : void {
    const sourceDepot = this.depotById(sourceDepotId);
    const targetDepot = this.depotById(targetDepotId);

    if (sourceDepot === undefined) {
      throw new Error('Source depot not found');
    }

    if (targetDepot === undefined) {
      throw new Error('Target depot not found');
    }

    if (sourceDepot!.numberOfBoxes < numberOfBoxes) {
      throw new Error(`${numberOfBoxes} exceeds the number of available boxes in the source.`);
    }

    sourceDepot!.numberOfBoxes -= numberOfBoxes;
    targetDepot!.numberOfBoxes += numberOfBoxes;
  }

  public setBoxes(depotId: number, newNumberOfBoxes: number) : void {
    console.log(`------> ${inventoryApiUrl.href}`);
    const depot = this.depotById(depotId);

    if (depot === undefined) {
      throw new Error('Depot not found');
    }

    const setInventoryRequest: SetInventoryRequest = {
      station: depotId,
      num_boxes: newNumberOfBoxes,
      notes: ''
    };

    this.http.post<Inventory>(inventoryApiUrl.href, setInventoryRequest)
      .subscribe(inventory => {
        depot.numberOfBoxes = inventory.num_boxes;
      });
  }
}

