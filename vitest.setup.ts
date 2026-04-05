import '@testing-library/jest-dom';
import { vi, beforeEach, afterEach } from 'vitest';

// Mock window.matchMedia (not available in jsdom)
const matchMediaMock = vi.fn().mockImplementation((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: matchMediaMock,
});

// Mock the Notification API (not available in jsdom)
const NotificationMock = class {
  static permission = 'default';
  static requestPermission = vi.fn().mockResolvedValue('default');
  constructor(_title: string, _options?: NotificationOptions) {}
} as unknown as typeof Notification;

Object.defineProperty(window, 'Notification', {
  writable: true,
  configurable: true,
  value: NotificationMock,
});

// Clear localStorage and reset mocks before each test to avoid cross-test pollution
beforeEach(() => {
  localStorage.clear();
  // Reset matchMedia to return false (light mode) by default
  matchMediaMock.mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
  // Reset document dark class
  document.documentElement.classList.remove('dark');
});
