import { TestBed } from '@angular/core/testing';

import { DepotService } from './depot.service';

describe('DepotService', () => {
  let service: DepotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
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
      expect(targetDepot.numberOfBoxes).toBe(10);
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
});
