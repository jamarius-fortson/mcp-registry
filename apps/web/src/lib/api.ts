const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getServers(query: string = "") {
  const res = await fetch(`${API_BASE_URL}/v1/search?q=${query}`, { cache: 'no-store' });
  if (!res.ok) throw new Error("Failed to fetch servers");
  return res.json();
}

export async function getServerDetail(name: string, version: string = "1.2.0") {
  // name could be "@test/postgres-mcp", so we split it
  const sanitizedName = name.startsWith("@") ? name.substring(1) : name;
  const res = await fetch(`${API_BASE_URL}/v1/servers/${sanitizedName}/${version}`, { cache: 'no-store' });
  if (!res.ok) throw new Error("Failed to fetch server detail");
  return res.json();
}

export async function getCapabilities(query: string = "") {
  const res = await fetch(`${API_BASE_URL}/v1/capabilities?q=${query}`, { cache: 'no-store' });
  if (!res.ok) throw new Error("Failed to fetch capabilities");
  return res.json();
}
