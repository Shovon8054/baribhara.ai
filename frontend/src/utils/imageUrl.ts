const API_URL = import.meta.env.VITE_API_URL || "";

// Extract base backend URL (e.g., https://baribhara-ai.onrender.com from https://baribhara-ai.onrender.com/api)
export const BACKEND_URL = API_URL.endsWith("/api")
  ? API_URL.slice(0, -4)
  : API_URL.startsWith("http")
  ? new URL(API_URL).origin
  : "";

export const getImageUrl = (path?: string | null): string => {
  const fallbackPath = "/uploads/properties/image-unavailable.svg";
  const targetPath = path || fallbackPath;
  
  if (
    targetPath.startsWith("http://") ||
    targetPath.startsWith("https://") ||
    targetPath.startsWith("data:")
  ) {
    return targetPath;
  }
  
  const cleanPath = targetPath.startsWith("/") ? targetPath : `/${targetPath}`;
  
  if (BACKEND_URL) {
    return `${BACKEND_URL}${cleanPath}`;
  }
  
  return cleanPath;
};

export const DEFAULT_FALLBACK_IMAGE = getImageUrl(null);
