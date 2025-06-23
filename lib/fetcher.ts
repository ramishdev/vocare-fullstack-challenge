
export default async function fetcher(
  input: RequestInfo,
  init?: RequestInit
): Promise<any> {
  const res = await fetch(input, init);
  if (!res.ok) {
    let errorInfo = null;
    try {
      errorInfo = await res.json();
    } catch {}
    const error = new Error(
      errorInfo?.message || res.statusText || 'An error occurred while fetching'
    );
    Object.assign(error, {
      status: res.status,
      info: errorInfo,
    });
    throw error;
  }
  return res.json();
}
