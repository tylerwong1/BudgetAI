// api.js
const API_URL = "http://127.0.0.1:8080";

export async function apiRequest(
  endpoint: string,
  method = "GET",
  body?: Record<string, unknown> | FormData | null,
) {
  // Set up headers conditionally
  const headers: Record<string, string> = {};

  if (!(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // Define request options
  const options: RequestInit = {
    method,
    credentials: "include",
    headers,
    ...(body && {
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  };

  // Perform the request
  const response = await fetch(`${API_URL}${endpoint}`, options);

  // Handle response errors
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  // Parse the JSON response
  return response.json();
}
