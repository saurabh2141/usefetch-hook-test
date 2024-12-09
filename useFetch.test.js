import { renderHook, act } from '@testing-library/react-hooks';
import useFetch from './useFetch'; // Assuming the hook is in 'your-component-path'

describe('useFetch Hook', () => {
  // Mock the fetch function and process.env.REACT_APP_API_BASE_URL
  const mockFetch = jest.fn();
  const originalBaseUrl = process.env.REACT_APP_API_BASE_URL;

  beforeEach(() => {
    global.fetch = mockFetch;
    process.env.REACT_APP_API_BASE_URL = 'https://api.example.com';
  });

  afterEach(() => {
    global.fetch = undefined;
    process.env.REACT_APP_API_BASE_URL = originalBaseUrl;
    jest.resetAllMocks();
  });

  it('should initially set isLoading to true', () => {
    const { result } = renderHook(() => useFetch('/users'));
    expect(result.current.isLoading).toBe(true);
  });

  it('should fetch data from the correct URL', async () => {
    const urlPath = '/users';
    renderHook(() => useFetch(urlPath));
    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/users');
  });

  it('should update data and isLoading on successful fetch', async () => {
    const mockData = [{ id: 1, name: 'John Doe' }];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });
    const { result, waitForNextUpdate } = renderHook(() => useFetch('/users'));
    await waitForNextUpdate();

    expect(result.current.data).toEqual(mockData);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should update error and isLoading on failed fetch', async () => {
    const mockError = new Error('Failed to fetch');
    mockFetch.mockRejectedValueOnce(mockError);

    const { result, waitForNextUpdate } = renderHook(() => useFetch('/users'));
    await waitForNextUpdate();

    expect(result.current.error).toEqual(mockError);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeNull();
  });

  it('should refetch when urlPath changes', async () => {
    const { result, rerender, waitForNextUpdate } = renderHook(
      ({ urlPath }) => useFetch(urlPath),
      { initialProps: { urlPath: '/users' } }
    );

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, name: 'John Doe' }]
    });

    await waitForNextUpdate();

    // Change urlPath and check if fetch is called again
    rerender({ urlPath: '/posts' });
    expect(mockFetch).toHaveBeenCalledTimes(2); // Fetched twice
    expect(mockFetch).toHaveBeenLastCalledWith('https://api.example.com/posts'); 
  });

  it('should use the provided baseUrl from environment variable', async () => {
    process.env.REACT_APP_API_BASE_URL = 'https://test-api.com';
    renderHook(() => useFetch('/users'));
    expect(mockFetch).toHaveBeenCalledWith('https://test-api.com/users');
  });
});