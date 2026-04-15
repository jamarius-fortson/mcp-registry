import { getServerDetail } from "@/lib/api";
import Link from "next/link";

export default async function ServerPage({ params }: { params: { name: string[] } }) {
  // name is an array because it's a catch-all route e.g. ["%40test", "postgres-mcp"]
  const fullName = decodeURIComponent(params.name.join("/"));
  const data = await getServerDetail(fullName);
  const { metadata } = data;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header / Breadcrumbs */}
      <nav className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link href="/" className="text-white/40 hover:text-white transition-colors">Registry</Link>
          <span className="text-white/10">/</span>
          <span className="font-medium">{fullName}</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Metadata & Install */}
        <div className="lg:col-span-2">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">{fullName}</h1>
            <p className="text-xl text-white/50 mb-8">{metadata.description}</p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex flex-col gap-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Runtime</span>
                <span className="font-mono text-blue-400">{metadata.runtime.type}</span>
              </div>
              <div className="flex flex-col gap-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Version</span>
                <span>{metadata.version}</span>
              </div>
              <div className="flex flex-col gap-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-white/30 tracking-widest">License</span>
                <span>{metadata.license}</span>
              </div>
            </div>
          </div>

          {/* Tools List (Introspection Results) */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-semibold">Capabilities</h2>
              <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20 uppercase">Auto-Introspected</span>
            </div>

            {data.introspection_passed ? (
              <div className="grid gap-4">
                {data.introspection_data.tools?.map((tool: any) => (
                  <div key={tool.name} className="bg-[#111] border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                      </div>
                      <h3 className="text-lg font-bold">{tool.name}</h3>
                    </div>
                    <p className="text-white/50 mb-6">{tool.description || "No description provided."}</p>
                    
                    <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                      <pre className="text-xs text-blue-300 font-mono overflow-x-auto">
                        {JSON.stringify(tool.inputSchema, null, 2)}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
                <p className="text-white/30 italic">Introspection results pending or failed.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Install Snippets */}
        <div className="space-y-6">
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 sticky top-24">
            <h3 className="font-bold mb-4">Install This Server</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-white/30 tracking-widest px-1">via CLI</label>
                <div className="bg-black border border-white/5 p-3 rounded-xl font-mono text-xs flex items-center justify-between group">
                  <span className="text-blue-400">mcpx install {fullName}</span>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity"><svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg></button>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs font-medium text-white/50">One-click linking ready</span>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-medium transition-all active:scale-95 text-sm">
                  Add to Claude Desktop
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
