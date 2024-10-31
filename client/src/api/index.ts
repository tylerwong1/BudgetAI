// api.js
const API_URL = "http://127.0.0.1:8080";

export async function apiRequest(
  endpoint: string,
  method = "GET",
  body?: Record<string, unknown> | null,
) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    ...(body && { body: JSON.stringify(body) }),
  };

  const response = await fetch(`${API_URL}${endpoint}`, options);

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  return response.json();
}
