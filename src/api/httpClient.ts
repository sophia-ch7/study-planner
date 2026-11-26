const BASE_URL = import.meta.env.VITE_API_URL || "https://dummyjson.com";

export interface RequestOptions extends RequestInit {
  signal?: AbortSignal;
}

export async function httpClient<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      throw new Error(
        `HTTP Error! Status: ${response.status} ${response.statusText}`,
      );
    }

    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw error;
    }
    console.error(`[API Error] Request failed for ${url}:`, error);
    throw error;
  }
}
