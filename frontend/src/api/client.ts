const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');
export class ApiError extends Error {
  status?: number;
  detail?: unknown;
  constructor(message:string, status?:number, detail?:unknown) { super(message); this.status=status; this.detail=detail; }
}
export async function apiFetch<T>(path:string, init?:RequestInit):Promise<T> {
  let response: Response;
  try { response = await fetch(`${API_BASE_URL}${path}`, { headers:{ 'Content-Type':'application/json', ...(init?.headers || {}) }, ...init }); }
  catch { throw new ApiError('Unable to reach the Memory Lab backend. Start FastAPI at http://localhost:8000.'); }
  let data: unknown;
  try { data = await response.json(); } catch { throw new ApiError('Backend returned a malformed response.', response.status); }
  if (!response.ok) throw new ApiError(typeof (data as {detail?:unknown}).detail === 'string' ? (data as {detail:string}).detail : `Request failed (${response.status}).`, response.status, data);
  return data as T;
}
