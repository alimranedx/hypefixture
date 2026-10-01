import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getDynamicTicketEvents } from '@/lib/tickets';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').toLowerCase().trim();

    if (!q) {
      return NextResponse.json({
        success: true,
        query: '',
        events: [],
        sports: [],
        venues: [],
        total: 0,
      });
    }

    const [allEvents, allSports] = await Promise.all([
      getDynamicTicketEvents(),
      prisma.sportCategory.findMany({ where: { isActive: true } }),
    ]);

    // Search events
    const matchingEvents = allEvents.filter((e) => {
      const haystack = `${e.title} ${e.homeTeam} ${e.awayTeam} ${e.tournament} ${e.venueName} ${e.city} ${e.country} ${e.sport}`.toLowerCase();
      return haystack.includes(q);
    });

    // Search sports
    const matchingSports = allSports.filter((s) =>
      s.name.toLowerCase().includes(q) || s.slug.toLowerCase().includes(q) || (s.description && s.description.toLowerCase().includes(q))
    );

    // Extract unique matching venues
    const venuesSet = new Set<string>();
    const matchingVenues: { name: string; city: string; country: string; eventCount: number }[] = [];

    matchingEvents.forEach((e) => {
      const key = `${e.venueName}-${e.city}`;
      if (!venuesSet.has(key)) {
        venuesSet.add(key);
        matchingVenues.push({
          name: e.venueName,
          city: e.city,
          country: e.country,
          eventCount: matchingEvents.filter((ev) => ev.venueName === e.venueName).length,
        });
      }
    });

    return NextResponse.json({
      success: true,
      query: q,
      events: matchingEvents,
      sports: matchingSports,
      venues: matchingVenues,
      total: matchingEvents.length + matchingSports.length,
    });
  } catch (error: any) {
    console.error('Search API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to perform search' }, { status: 500 });
  }
}
