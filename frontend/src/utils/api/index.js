// Import axios for api calls
import axios from "axios";

// Setup the base url to the backend server
const baseUrl = "/";

// Export the axios component with some basic headers and base url defined above
export default axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
