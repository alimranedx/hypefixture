import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAllTicketEvents } from '@/lib/tickets';

export async function GET() {
  try {
    const dbFixtures = await prisma.ticketFixture.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    if (dbFixtures.length > 0) {
      return NextResponse.json({ success: true, tickets: dbFixtures });
    }

    // Fallback to static initial events
    const staticEvents = getAllTicketEvents();
    return NextResponse.json({ success: true, tickets: staticEvents });
  } catch (error: any) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
