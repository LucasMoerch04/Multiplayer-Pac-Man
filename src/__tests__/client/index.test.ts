import { describe, it, expect } from '@jest/globals';

describe('index.html', () => {
    it('should contain a canvas element with id "gameCanvas"', () => {
        const canvas = document.querySelector('canvas#gameCanvas');
        expect(canvas).toBeDefined();
      });    
});
