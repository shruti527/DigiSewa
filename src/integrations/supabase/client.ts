// This file previously connected to Supabase.
// Supabase has been removed — this is now a placeholder for MongoDB integration.

// Example: API base URL for backend requests to MongoDB
export const API_BASE_URL = "http://localhost:5000/api"; 

// Example function to fetch data from MongoDB via your backend
export async function fetchData(endpoint: string) {
  const res = await fetch(`${API_BASE_URL}/${endpoint}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${endpoint}`);
  }
  return res.json();
}

// Usage in frontend:
// import { fetchData } from "@/integrations/mongodb/client";
// const licenses = await fetchData("licenses");
