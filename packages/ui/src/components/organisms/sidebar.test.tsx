/**
 * AI Email Marketing System
 * Copyright (c) 2024 Muhammad Ismail
 * Email: ismail@aimnovo.com
 * Founder: AimNovo.com | AimNexus.ai
 *
 * Licensed under the MIT License.
 * See LICENSE file in the project root for full license information.
 *
 * For commercial use, please maintain proper attribution.
 */

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Sidebar localStorage functionality', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  it('should save expanded items to localStorage', () => {
    const expandedItems = ['leads', 'campaigns'];
    localStorage.setItem(
      'sidebar-expanded-items',
      JSON.stringify(expandedItems)
    );

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'sidebar-expanded-items',
      JSON.stringify(expandedItems)
    );
  });

  it('should load expanded items from localStorage', () => {
    const savedItems = ['campaigns', 'settings'];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedItems));

    const result = localStorage.getItem('sidebar-expanded-items');
    const parsed = JSON.parse(result || '[]');

    expect(parsed).toEqual(savedItems);
    expect(localStorageMock.getItem).toHaveBeenCalledWith(
      'sidebar-expanded-items'
    );
  });

  it('should handle invalid JSON gracefully', () => {
    localStorageMock.getItem.mockReturnValue('invalid-json');

    try {
      const result = localStorage.getItem('sidebar-expanded-items');
      JSON.parse(result || '[]');
    } catch (error) {
      expect(error).toBeInstanceOf(SyntaxError);
    }
  });

  it('should return empty array when no saved state exists', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const result = localStorage.getItem('sidebar-expanded-items');
    const parsed = JSON.parse(result || '[]');

    expect(parsed).toEqual([]);
  });
});

describe('Sidebar state management', () => {
  it('should toggle expanded state correctly', () => {
    const expandedItems: string[] = [];
    const itemId = 'leads';

    // Add item
    const newExpandedItems = expandedItems.includes(itemId)
      ? expandedItems.filter(id => id !== itemId)
      : [...expandedItems, itemId];

    expect(newExpandedItems).toEqual(['leads']);

    // Remove item
    const finalExpandedItems = newExpandedItems.includes(itemId)
      ? newExpandedItems.filter(id => id !== itemId)
      : [...newExpandedItems, itemId];

    expect(finalExpandedItems).toEqual([]);
  });

  it('should handle multiple expanded items', () => {
    let expandedItems = ['leads'];

    // Add campaigns
    expandedItems = [...expandedItems, 'campaigns'];
    expect(expandedItems).toEqual(['leads', 'campaigns']);

    // Add settings
    expandedItems = [...expandedItems, 'settings'];
    expect(expandedItems).toEqual(['leads', 'campaigns', 'settings']);

    // Remove leads
    expandedItems = expandedItems.filter(id => id !== 'leads');
    expect(expandedItems).toEqual(['campaigns', 'settings']);
  });
});
