const API_URL = import.meta.env.VITE_API_URL || "";

// Extract base backend URL (e.g., https://baribhara-ai.onrender.com from https://baribhara-ai.onrender.com/api)
export const BACKEND_URL = API_URL.endsWith("/api")
  ? API_URL.slice(0, -4)
  : API_URL.startsWith("http")
  ? new URL(API_URL).origin
  : "";

export const getImageUrl = (path?: string | null): string => {
  if (!path) return "/uploads/properties/image-unavailable.svg";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  // If path starts with /uploads and BACKEND_URL exists, prepend BACKEND_URL
  if (cleanPath.startsWith("/uploads")) {
    return `${BACKEND_URL}${cleanPath}`;
  }
  
  return cleanPath;
};
