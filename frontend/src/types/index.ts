export interface ShortenRequest {
  url: string;
}

export interface ShortenResponse {
  code: string;
  short_url: string;
}

export interface HealthResponse {
  status: string;
  database?: string;
}

export interface HistoryItem {
  id: string;
  originalUrl: string;
  shortUrl: string;
  code: string;
  createdAt: string;
}
