import { act, render, screen } from '@testing-library/react';
import { mockWordPressAPI } from '../../__mocks__/wordpress-api';
import { AppProvider, useApp } from '../../context/AppContext';

// Mock fetch
global.fetch = jest.fn();

// Test component to access context
const TestComponent = () => {
  const { vehicles, loading, error, fetchVehicles, clearCache } = useApp();

  return (
    <div>
      <div data-testid='loading'>{loading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid='error'>{error || 'No Error'}</div>
      <div data-testid='vehicles-count'>{vehicles.length}</div>
      <button onClick={() => fetchVehicles()}>Fetch Vehicles</button>
      <button onClick={() => clearCache()}>Clear Cache</button>
    </div>
  );
};

describe('AppContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides initial state', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    expect(screen.getByTestId('error')).toHaveTextContent('No Error');
    expect(screen.getByTestId('vehicles-count')).toHaveTextContent('0');
  });

  it('fetches vehicles successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockWordPressAPI.vehicles.getVehicles()),
    });

    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    const fetchButton = screen.getByText('Fetch Vehicles');

    await act(async () => {
      fetchButton.click();
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(screen.getByTestId('vehicles-count')).toHaveTextContent('2');
    expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
  });

  it('handles fetch vehicles error', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network Error')
    );

    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    const fetchButton = screen.getByText('Fetch Vehicles');

    await act(async () => {
      fetchButton.click();
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(screen.getByTestId('error')).toHaveTextContent('Network Error');
    expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
  });

  it('clears cache successfully', async () => {
    // First fetch some data
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockWordPressAPI.vehicles.getVehicles()),
    });

    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    const fetchButton = screen.getByText('Fetch Vehicles');
    const clearButton = screen.getByText('Clear Cache');

    await act(async () => {
      fetchButton.click();
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(screen.getByTestId('vehicles-count')).toHaveTextContent('2');

    await act(async () => {
      clearButton.click();
    });

    expect(screen.getByTestId('vehicles-count')).toHaveTextContent('0');
  });

  it('manages loading state correctly', async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise(resolve => {
      resolvePromise = resolve;
    });

    (global.fetch as jest.Mock).mockReturnValueOnce(promise);

    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    const fetchButton = screen.getByText('Fetch Vehicles');

    await act(async () => {
      fetchButton.click();
    });

    expect(screen.getByTestId('loading')).toHaveTextContent('Loading');

    await act(async () => {
      resolvePromise!({
        ok: true,
        json: () => Promise.resolve(mockWordPressAPI.vehicles.getVehicles()),
      });
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
  });
});
