//export const API_BASE_URL = "63.177.226.133:5062";
export const API_BASE_URL = "192.168.1.113:5062";
/**
 * A utility function to make API calls.
 * @param {string} endpoint - The API endpoint (e.g., "/createGame").
 * @param {string} method - The HTTP method (e.g., "GET", "POST").
 * @param {Object} [body] - The request body (for POST/PUT requests).
 * @returns {Promise} - A promise that resolves to the response data.
 */
export async function apiCall(endpoint, method = "GET", body = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`http://${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  return response;
}
