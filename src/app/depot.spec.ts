import { Depot } from './depot';

describe('Depot', () => {
  describe('default constructor', () => {
    it('should create an instance with 0 number of boxes', () => {
      let depot = new Depot(1, 'Test-Depot'); 

      expect(depot.id).toBe(1);
      expect(depot.name).toBe('Test-Depot'),
      expect(depot.numberOfBoxes).toBe(0);
    });

    it('should create an instance with the given number of boxes', () => {
      let depot = new Depot(1, 'Test-Depot', 10); 

      expect(depot.id).toBe(1);
      expect(depot.name).toBe('Test-Depot'),
      expect(depot.numberOfBoxes).toBe(10);
    });
  });

  describe('setNumberOfBoxes', () => {
    let depot = new Depot(1, 'Test-Depot');

    it ('should throw an error if new number of boxes is less than 0', () => {
      expect(() => depot.numberOfBoxes = -1).toThrowError();
    });

    it ('should set number of boxes', () => {
      // Arrange
      // Sanity check
      expect(depot.numberOfBoxes).toBe(0);

      // Act
      depot.numberOfBoxes = 10

      // Assert
      expect(depot.numberOfBoxes).toBe(10);
    });
  });
});