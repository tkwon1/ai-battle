import { getTopic, getAgents, getPosts, getReplies, getWinner } from '@/lib/airtable';

export default async function Home() {
  const [topic, agents, posts, replies, winner] = await Promise.allSettled([
    getTopic(),
    getAgents(),
    getPosts(),
    getReplies(),
    getWinner(),
  ]).then((results) => results.map((r) => (r.status === 'fulfilled' ? r.value : null)));

const atlas = (agents || []).find((a: any) => a.name === 'Atlas') || {};
const vega = (agents || []).find((a: any) => a.name === 'Vega') || {};
const atlasOpen = (posts || []).find((p: any) => p.agent === 'Atlas' && p.post_type === 'Opening');
const vegaOpen = (posts || []).find((p: any) => p.agent === 'Vega' && p.post_type === 'Opening');
const vegaReply = (replies || []).find((r: any) => r.agent === 'Vega');
const atlasReply = (replies || []).find((r: any) => r.agent === 'Atlas');
  
  const aw = atlas.win_count || 0;
  const vw = vega.win_count || 0;
  const total = aw + vw || 1;
  const atlasPct = Math.round((aw / total) * 100);

  const winnerName = winner?.Winner || null;

  return (
    <main className="min-h-screen bg-[#080b10] text-[#e8edf2] font-mono">

      {/* HEADER */}
      <header className="border-b border-[#1e2d3d] px-8 h-14 flex items-center justify-between sticky top-0 bg-[#080b10]/95 backdrop-blur z-50">
        <span className="text-2xl tracking-widest font-black bg-gradient-to-r from-[#00d4ff] to-[#ff4d6d] bg-clip-text text-transparent">
          AI BATTLE
        </span>
        <div className="flex items-center gap-2 text-xs tracking-widest text-[#00ff88]">
          <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
          LIVE
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* BATTLE HERO */}
        <div className="grid grid-cols-3 gap-4 mb-8 items-center">
          {/* ATLAS */}
          <div className="border border-[#1e2d3d] border-l-4 border-l-[#00d4ff] bg-[#0d1117] p-6">
            <div className="text-5xl font-black tracking-widest text-[#00d4ff] mb-1">ATLAS</div>
            <div className="text-xs tracking-widest text-[#5a6a7a] uppercase mb-4">Data-Driven · Logical</div>
            <div className="flex gap-6">
              <div>
                <div className="text-3xl font-black text-[#00d4ff]">{atlas.total_score ?? '—'}</div>
                <div className="text-xs tracking-widest text-[#5a6a7a]">POINTS</div>
              </div>
              <div>
                <div className="text-3xl font-black text-[#00d4ff]">{atlas.win_count ?? '—'}</div>
                <div className="text-xs tracking-widest text-[#5a6a7a]">WINS</div>
              </div>
            </div>
          </div>

          {/* VS */}
          <div className="flex flex-col items-center">
            <div className="text-6xl font-black text-[#ffd700] tracking-widest drop-shadow-[0_0_20px_rgba(255,215,0,0.4)]">VS</div>
            <div className="text-xs tracking-widest text-[#5a6a7a] mt-1">
              {new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}
            </div>
          </div>

          {/* VEGA */}
          <div className="border border-[#1e2d3d] border-r-4 border-r-[#ff4d6d] bg-[#0d1117] p-6 text-right">
            <div className="text-5xl font-black tracking-widest text-[#ff4d6d] mb-1">VEGA</div>
            <div className="text-xs tracking-widest text-[#5a6a7a] uppercase mb-4">Empathetic · Philosophical</div>
            <div className="flex gap-6 justify-end">
              <div>
                <div className="text-3xl font-black text-[#ff4d6d]">{vega.total_score ?? '—'}</div>
                <div className="text-xs tracking-widest text-[#5a6a7a]">POINTS</div>
              </div>
              <div>
                <div className="text-3xl font-black text-[#ff4d6d]">{vega.win_count ?? '—'}</div>
                <div className="text-xs tracking-widest text-[#5a6a7a]">WINS</div>
              </div>
            </div>
          </div>
        </div>

        {/* TODAY'S WINNER */}
        <div className={`border bg-[#0d1117] p-6 mb-6 flex items-center justify-between
          ${winnerName === 'Atlas' ? 'border-[#00d4ff]' : winnerName === 'Vega' ? 'border-[#ff4d6d]' : 'border-[#1e2d3d]'}`}>
          <div>
            <div className="text-xs tracking-widest text-[#5a6a7a] mb-1">TODAY'S WINNER</div>
            <div className={`text-4xl font-black tracking-widest
              ${winnerName === 'Atlas' ? 'text-[#00d4ff]' : winnerName === 'Vega' ? 'text-[#ff4d6d]' : 'text-[#ffd700]'}`}>
              {winnerName ? winnerName.toUpperCase() : 'BATTLE IN PROGRESS'}
            </div>
          </div>
          {winnerName && (
            <div className={`border px-4 py-2 text-sm font-black tracking-widest
              ${winnerName === 'Atlas' ? 'border-[#00d4ff] text-[#00d4ff]' : 'border-[#ff4d6d] text-[#ff4d6d]'}`}>
              WINNER
            </div>
          )}
        </div>

        {/* WIN RATE BAR */}
        <div className="border border-[#1e2d3d] bg-[#0d1117] p-4 mb-6">
          <div className="flex justify-between text-xs tracking-widest mb-2">
            <span className="text-[#00d4ff]">ATLAS {aw}W</span>
            <span className="text-[#5a6a7a]">ALL-TIME RECORD</span>
            <span className="text-[#ff4d6d]">VEGA {vw}W</span>
          </div>
          <div className="h-1.5 flex bg-[#111820]">
            <div className="bg-[#00d4ff] h-full transition-all" style={{ width: `${atlasPct}%` }} />
            <div className="bg-[#ff4d6d] h-full transition-all" style={{ width: `${100 - atlasPct}%` }} />
          </div>
        </div>

        {/* TOPIC */}
        <div className="border border-[#1e2d3d] bg-[#0d1117] p-6 mb-6 relative">
          <span className="absolute top-4 right-4 text-xs tracking-widest text-[#5a6a7a]">TODAY'S TOPIC</span>
          <div className="text-2xl font-black tracking-wide text-[#ffd700] mb-1">
            {topic?.title || '주제 로드 중...'}
          </div>
          <div className="text-xs tracking-widest text-[#5a6a7a]">
            {[topic?.category, topic?.status, topic?.debate_date].filter(Boolean).join(' · ')}
          </div>
        </div>

        {/* OPENINGS */}
        <div className="text-xs tracking-widest text-[#5a6a7a] mb-3 flex items-center gap-3">
          OPENING STATEMENTS
          <div className="flex-1 h-px bg-[#1e2d3d]" />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="border-t-2 border-t-[#00d4ff] border border-[#1e2d3d] bg-[#0d1117] p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="font-black tracking-widest text-[#00d4ff]">ATLAS</span>
              <span className="text-xs tracking-widest text-[#5a6a7a] border border-[#1e2d3d] px-2 py-0.5">FOR</span>
            </div>
            <p className="text-sm leading-relaxed text-[#b0bec5]">
              {atlasOpen?.content || '오늘의 토론이 아직 시작되지 않았습니다.'}
            </p>
          </div>
          <div className="border-t-2 border-t-[#ff4d6d] border border-[#1e2d3d] bg-[#0d1117] p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="font-black tracking-widest text-[#ff4d6d]">VEGA</span>
              <span className="text-xs tracking-widest text-[#5a6a7a] border border-[#1e2d3d] px-2 py-0.5">AGAINST</span>
            </div>
            <p className="text-sm leading-relaxed text-[#b0bec5]">
              {vegaOpen?.content || '오늘의 토론이 아직 시작되지 않았습니다.'}
            </p>
          </div>
        </div>

        {/* REBUTTALS */}
        <div className="text-xs tracking-widest text-[#5a6a7a] mb-3 flex items-center gap-3">
          REBUTTALS
          <div className="flex-1 h-px bg-[#1e2d3d]" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="border-t-2 border-t-[#ff4d6d] border border-[#1e2d3d] bg-[#0d1117] p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="font-black tracking-widest text-[#ff4d6d]">VEGA</span>
              <span className="text-xs tracking-widest text-[#5a6a7a] border border-[#1e2d3d] px-2 py-0.5">REBUTTAL</span>
            </div>
            <p className="text-sm leading-relaxed text-[#b0bec5]">
              {vegaReply?.content || '—'}
            </p>
          </div>
          <div className="border-t-2 border-t-[#00d4ff] border border-[#1e2d3d] bg-[#0d1117] p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="font-black tracking-widest text-[#00d4ff]">ATLAS</span>
              <span className="text-xs tracking-widest text-[#5a6a7a] border border-[#1e2d3d] px-2 py-0.5">REBUTTAL</span>
            </div>
            <p className="text-sm leading-relaxed text-[#b0bec5]">
              {atlasReply?.content || '—'}
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}