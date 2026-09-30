import { NextRequest } from 'next/server';
import { getAggregatedLiveScores, SportCategory } from '@/lib/liveScores';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sportParam = searchParams.get('sport') as SportCategory | 'all' | null;
  const onlyLiveParam = searchParams.get('onlyLive') === 'true';

  const validSports = ['all', 'football', 'cricket', 'nfl', 'rugby', 'nba'];
  const selectedSport = sportParam && validSports.includes(sportParam) ? sportParam : 'all';

  const encoder = new TextEncoder();
  let intervalId: NodeJS.Timeout | null = null;
  let heartbeatId: NodeJS.Timeout | null = null;
  let isClosed = false;

  const stream = new ReadableStream({
    async start(controller) {
      const safeEnqueue = (payload: string) => {
        if (isClosed) return;
        try {
          controller.enqueue(encoder.encode(payload));
        } catch {
          isClosed = true;
        }
      };

      try {
        // Send initial connection handshake
        safeEnqueue(
          `event: connected\ndata: ${JSON.stringify({ status: 'connected', time: new Date().toISOString() })}\n\n`
        );

        // Send initial data snapshot immediately
        const initialData = await getAggregatedLiveScores(selectedSport);
        if (onlyLiveParam) {
          initialData.matches = initialData.matches.filter((m) => m.isLive);
          initialData.totalMatches = initialData.matches.length;
        }
        safeEnqueue(`event: snapshot\ndata: ${JSON.stringify(initialData)}\n\n`);

        // Real-time automatic score push every 6 seconds
        intervalId = setInterval(async () => {
          if (isClosed) return;
          try {
            const freshData = await getAggregatedLiveScores(selectedSport);
            if (onlyLiveParam) {
              freshData.matches = freshData.matches.filter((m) => m.isLive);
              freshData.totalMatches = freshData.matches.length;
            }
            safeEnqueue(`event: score-update\ndata: ${JSON.stringify(freshData)}\n\n`);
          } catch (err) {
            // Keep connection healthy on intermittent network error
          }
        }, 6000);

        // Heartbeat comment ping every 15 seconds to prevent edge/proxy dropouts
        heartbeatId = setInterval(() => {
          if (isClosed) return;
          safeEnqueue(`: ping\n\n`);
        }, 15000);

        // Abort cleanup when client closes connection or browser tab
        req.signal.addEventListener('abort', () => {
          isClosed = true;
          if (intervalId) clearInterval(intervalId);
          if (heartbeatId) clearInterval(heartbeatId);
          try {
            controller.close();
          } catch {
            // Already closed
          }
        });
      } catch (err: any) {
        safeEnqueue(
          `event: error\ndata: ${JSON.stringify({ error: err?.message || 'Stream error' })}\n\n`
        );
        try {
          controller.close();
        } catch {
          // Already closed
        }
      }
    },
    cancel() {
      isClosed = true;
      if (intervalId) clearInterval(intervalId);
      if (heartbeatId) clearInterval(heartbeatId);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform, no-store',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
