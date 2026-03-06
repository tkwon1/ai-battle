const BASE = process.env.AIRTABLE_BASE;
const TOKEN = process.env.AIRTABLE_TOKEN;
const API = `https://api.airtable.com/v0/${BASE}`;

const headers = {
  Authorization: `Bearer ${TOKEN}`,
};

async function fetchTable(table, params = '') {
  const res = await fetch(`${API}/${encodeURIComponent(table)}?${params}`, {
    headers,
    next: { revalidate: 3600 }, // 1시간 캐시
  });
  if (!res.ok) throw new Error(`Airtable error: ${res.status}`);
  const data = await res.json();
  return data.records;
}

// 오늘의 주제
export async function getTopic() {
  const records = await fetchTable(
    'Topics',
    'sort[0][field]=debate_date&sort[0][direction]=desc&maxRecords=1'
  );
  return records[0]?.fields || null;
}

// Agent 정보 (점수, 승수)
export async function getAgents() {
  const records = await fetchTable(
    'Agents',
    'sort[0][field]=win_count&sort[0][direction]=desc'
  );
  return records.map((r) => r.fields);
}

// 오늘의 토론 포스트
export async function getPosts() {
  const records = await fetchTable(
    'Agent Post',
    'sort[0][field]=created_at&sort[0][direction]=desc&maxRecords=10'
  );
  return records.map((r) => r.fields);
}

// 반박글
export async function getReplies() {
  const records = await fetchTable(
    'Agent Replies',
    'sort[0][field]=created_at&sort[0][direction]=desc&maxRecords=10'
  );
  return records.map((r) => r.fields);
}

// 오늘의 승자
export async function getWinner() {
  try {
    const records = await fetchTable(
      'Agents',
      'sort[0][field]=win_count&sort[0][direction]=desc&maxRecords=2'
    );
    if (!records || records.length < 2) return null;
    
    const top = records[0].fields;
    const second = records[1].fields;
    
    // 1등이 2등보다 승수가 많으면 승자
    if ((top.win_count || 0) > (second.win_count || 0)) {
      return { Winner: top.name };
    }
    return null; // 동점이면 null
  } catch (e) {
    console.error('getWinner failed:', e);
    return null;
  }
}


// 히스토리 (종료된 토론)
export async function getHistory() {
  const [topics, stances] = await Promise.all([
    fetchTable(
      'Topics',
      'filterByFormula=status%3D"Closed"&sort[0][field]=debate_date&sort[0][direction]=desc&maxRecords=30'
    ),
    fetchTable('Stances', 'maxRecords=100'),
  ]);

  const stanceMap = {};
  stances.forEach((s) => {
    if ((s.fields.is_winner === 1 || s.fields.is_winner === true) && s.fields.topic) {
      const id = Array.isArray(s.fields.topic) ? s.fields.topic[0] : s.fields.topic;
      stanceMap[id] = s.fields.Winner;
    }
  });

  return topics.map((t) => ({
    id: t.id,
    title: t.fields.title,
    date: t.fields.debate_date,
    category: t.fields.category,
    winner: stanceMap[t.id] || null,
  }));
}