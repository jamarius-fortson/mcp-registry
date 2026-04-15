import Link from "next/link";
import { getServers } from "@/lib/api";

export default async function Home() {
  const featuredServers = await getServers("");

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
            The MCP Registry
          </h1>
          <p className="text-xl md:text-2xl text-white/50 mb-10 max-w-2xl mx-auto font-light">
            Discover, discover, and install Model Context Protocol servers with one command. 
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-3 rounded-xl font-mono text-sm group transition-all hover:bg-white/10 hover:border-white/20">
              <span className="text-blue-400">$</span>
              <span>npm install -g mcpx</span>
              <button className="ml-4 text-white/30 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              </button>
            </div>
            <Link 
              href="/search"
              className="bg-white text-black px-8 py-3 rounded-xl font-medium hover:bg-white/90 transition-all active:scale-95 shadow-lg shadow-white/5"
            >
              Explore Servers
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-2xl font-semibold">Featured Servers</h2>
          <Link href="/search" className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium">View all →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredServers.map((server: any) => (
            <Link 
              key={server.name}
              href={`/servers/${server.name.replace('/', '%2F')}`}
              className="group relative bg-[#111] border border-white/5 rounded-2xl p-6 transition-all hover:border-blue-500/30 hover:bg-[#141414] overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              </div>
              
              <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400 transition-colors">{server.name}</h3>
              <p className="text-sm text-white/50 line-clamp-2 leading-relaxed mb-6">
                {server.description || "No description provided."}
              </p>
              
              <div className="flex items-center gap-2 mt-auto">
                <span className="px-2 py-1 rounded-md bg-white/5 text-[10px] font-bold uppercase tracking-wider text-white/40 border border-white/5">stdio</span>
                <span className="px-2 py-1 rounded-md bg-white/5 text-[10px] font-bold uppercase tracking-wider text-blue-400/60 border border-blue-500/10">verified</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer (Simplified) */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto text-center text-white/20 text-sm">
          &copy; 2024 MCP Registry. Standardizing AI Tool Distribution.
        </div>
      </footer>
    </main>
  );
}
