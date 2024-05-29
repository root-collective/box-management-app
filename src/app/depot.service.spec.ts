import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { HttpClient } from '@angular/common/http';

import { DepotService, Inventory, SetInventoryRequest, Station, StationWithBoxEstimate } from './depot.service';

describe('DepotService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let service: DepotService;

  const depots : Station[] = [
    { id: 1, name: 'Langenklint', location: '' },
    { id: 2, name: 'Gifhorn', location: '' },
    { id: 3, name: 'Meinersen', location: '' }
  ];

  const depotsWithBoxEstimates : StationWithBoxEstimate[] = [
    { ...depots[0], estimate_boxes: 200 },
    { ...depots[1], estimate_boxes: 60 },
    { ...depots[2], estimate_boxes: 0 },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(DepotService);

    const req = httpTestingController.expectOne('https://localhost/boxmanagement/station/');
    expect(req.request.method).toEqual('GET');
    req.flush(depots);

    depotsWithBoxEstimates.forEach(depot => {
      const req = httpTestingController.expectOne(`https://localhost/boxmanagement/station/${depot.id}`);
      expect(req.request.method).toEqual('GET');
      req.flush(depot);
    });
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have loaded all depots at creation', () => {
    expect(service.depots.length).toBe(3);
  });

  describe('getById', () => {
    it('should return depot of id 1', () => {
      // Arrange

      // Act
      let result = service.depotById(1);

      // Assert
      expect(result).toBe(service.depots.find(d => d.id === 1)!);
    });

    it('should return undefined if id is -1', () => {
      // Arrange

      // Act
      let result = service.depotById(-1);

      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe('transferBoxes', () => {
    it('should transfer number of boxes', () => {
      // Arrange
      let sourceDepot = service.depots.find(d => d.id === 1)!;
      let targetDepot = service.depots.find(d => d.id === 2)!;

      // Act
      service.transferBoxes(1, 2, 10);

      // Assert
      expect(sourceDepot.numberOfBoxes).toBe(190);
      expect(targetDepot.numberOfBoxes).toBe(70);
    });

    it('should throw error if source depot id is not available', () => {
      // Arrange
      // Sanity-check
      expect(service.depots.find(d => d.id === -1)).toBeUndefined();

      // Act

      // Assert
      expect(() => service.transferBoxes(0, 2, 10)).toThrowError();
    });

    it('should throw error if target depot id is not available', () => {
      // Arrange
      // Sanity-check
      expect(service.depots.find(d => d.id === -1)).toBeUndefined();

      // Act

      // Assert
      expect(() => service.transferBoxes(1, 0, 10)).toThrowError();
    });

    it('should throw error if number of boxes to transfer exceeds the number of boxes in the source depot', () => {
      // Arrange
      let exceedingNumberOfBoxes = service.depots.find(d => d.id === 1)!.numberOfBoxes + 1;

      // Act

      // Assert
      expect(() => service.transferBoxes(1, 2, exceedingNumberOfBoxes)).toThrowError(`${exceedingNumberOfBoxes} exceeds the number of available boxes in the source.`);
    });
  });

  describe('depotsExceptIds', () => {
    it('should return all depots if ids are empty', () => {
      // Arrange
      const emptyIds: number[] = [];

      // Act
      const result = service.depotsExceptIds(emptyIds);

      // Assert
      expect(result.length).toBe(3);
    });

    it('should return all depots without id 1', () => {
      // Arrange
      const singleId: number[] = [1];

      // Act
      const result = service.depotsExceptIds(singleId);

      // Assert
      expect(result.length).toBe(2);
      expect(result).toContain(service.depots.find(d => d.id == 2)!);
      expect(result).toContain(service.depots.find(d => d.id == 3)!);
    });

    it('should return all depots without id 1 and 3', () => {
      // Arrange
      const singleId: number[] = [1, 3];

      // Act
      const result = service.depotsExceptIds(singleId);

      // Assert
      expect(result.length).toBe(1);
      expect(result).toContain(service.depots.find(d => d.id == 2)!);
    });
  })

  describe('setBoxes', () => {
    it('should set number of boxes', () => {
      // Arrange
      const depot = depotsWithBoxEstimates[0];
      const numberOfBoxes: number = depot.estimate_boxes + 1;

      // Act
      service.setBoxes(depot.id, numberOfBoxes);

      // Assert
      const req = httpTestingController.expectOne('https://localhost/boxmanagement/inventory/');
      expect(req.request.method).toEqual('POST');

      const body: SetInventoryRequest = req.request.body as SetInventoryRequest;

      expect(body.station).toBe(depot.id);
      expect(body.num_boxes).toBe(numberOfBoxes);
      expect(body.notes).toBe('');

      req.flush({
        id: 1,
        timestamp: new Date(),
        station: body.station,
        num_boxes: body.num_boxes,
        notes: body.notes,
      } as Inventory);

      expect(service.depotById(depot.id)?.numberOfBoxes).toBe(numberOfBoxes);
    });
  })
});
