import { NextRequest, NextResponse } from 'next/server';
import { getAggregatedLiveScores, SportCategory } from '@/lib/liveScores';

export const dynamic = 'force-dynamic';
export const revalidate = 20;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sportParam = searchParams.get('sport') as SportCategory | 'all' | null;
    const onlyLiveParam = searchParams.get('onlyLive') === 'true';

    const validSports = ['all', 'football', 'cricket', 'nfl', 'rugby', 'nba'];
    const selectedSport = sportParam && validSports.includes(sportParam) ? sportParam : 'all';

    const data = await getAggregatedLiveScores(selectedSport);

    if (onlyLiveParam) {
      data.matches = data.matches.filter((m) => m.isLive);
      data.totalMatches = data.matches.length;
    }

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=20, stale-while-revalidate=40',
      },
    });
  } catch (error: any) {
    console.error('Error fetching live matches:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve live scores',
        message: error?.message || 'Internal Server Error',
        timestamp: new Date().toISOString(),
        totalMatches: 0,
        liveNowCount: 0,
        matches: [],
      },
      { status: 500 }
    );
  }
}
