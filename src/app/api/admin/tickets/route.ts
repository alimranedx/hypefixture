import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { TICKET_EVENTS } from '@/lib/tickets';

// GET: Fetch all ticket fixtures for admin
export async function GET() {
  try {
    let fixtures = await prisma.ticketFixture.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // If database is empty, seed from TICKET_EVENTS so admin has ready European fixtures
    if (fixtures.length === 0) {
      for (const ev of TICKET_EVENTS) {
        const sgOffer = ev.offers.find((o) => o.vendorSlug === 'seatgeek');
        const shOffer = ev.offers.find((o) => o.vendorSlug === 'stubhub');
        const vgOffer = ev.offers.find((o) => o.vendorSlug === 'viagogo');

        await prisma.ticketFixture.upsert({
          where: { slug: ev.slug },
          update: {},
          create: {
            slug: ev.slug,
            title: ev.title,
            homeTeam: ev.homeTeam,
            awayTeam: ev.awayTeam,
            sport: ev.sport,
            tournament: ev.tournament,
            matchDate: ev.matchDate,
            kickoffUtc: ev.kickoffUtc,
            venueName: ev.venueName,
            city: ev.city,
            country: ev.country,
            venueCapacity: ev.venueCapacity,
            stadiumAddress: ev.stadiumAddress,
            minPrice: ev.minPrice,
            maxPrice: ev.maxPrice,
            currency: ev.currency,
            availableTickets: ev.availableTickets,
            demandStatus: ev.demandStatus,
            featuredImage: ev.featuredImage,
            seatgeekPrice: sgOffer ? sgOffer.price : ev.minPrice + 20,
            seatgeekUrl: sgOffer ? sgOffer.affiliateUrl : `https://seatgeek.com/search?search=${encodeURIComponent(ev.title)}&ref=ticketfixture`,
            stubhubPrice: shOffer ? shOffer.price : ev.minPrice,
            stubhubUrl: shOffer ? shOffer.affiliateUrl : `https://stubhub.com/search?q=${encodeURIComponent(ev.title)}&ref=ticketfixture`,
            viagogoPrice: vgOffer ? vgOffer.price : ev.minPrice + 15,
            viagogoUrl: vgOffer ? vgOffer.affiliateUrl : `https://viagogo.com/search?q=${encodeURIComponent(ev.title)}&ref=ticketfixture`,
            isActive: true,
          },
        });
      }

      fixtures = await prisma.ticketFixture.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json({ success: true, fixtures });
  } catch (error: any) {
    console.error('Error fetching admin ticket fixtures:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create or Update ticket fixture
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const {
      id,
      slug,
      title,
      homeTeam,
      awayTeam,
      sport = 'football',
      tournament = 'Premier League',
      matchDate,
      kickoffUtc,
      venueName,
      city,
      country = 'United Kingdom',
      venueCapacity = 60000,
      stadiumAddress,
      minPrice = 85,
      maxPrice = 500,
      currency = 'GBP',
      availableTickets = 500,
      demandStatus = 'HIGH_DEMAND',
      featuredImage = 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80',
      seatgeekPrice,
      seatgeekUrl,
      stubhubPrice,
      stubhubUrl,
      viagogoPrice,
      viagogoUrl,
      isActive = true,
    } = body;

    const normalizedSlug = (slug || `${homeTeam}-vs-${awayTeam}`).toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (id) {
      const updated = await prisma.ticketFixture.update({
        where: { id },
        data: {
          slug: normalizedSlug,
          title: title || `${homeTeam} vs ${awayTeam} Tickets`,
          homeTeam,
          awayTeam,
          sport,
          tournament,
          matchDate,
          kickoffUtc,
          venueName,
          city,
          country,
          venueCapacity: Number(venueCapacity),
          stadiumAddress: stadiumAddress || `${venueName}, ${city}`,
          minPrice: Number(minPrice),
          maxPrice: Number(maxPrice),
          currency,
          availableTickets: Number(availableTickets),
          demandStatus,
          featuredImage,
          seatgeekPrice: seatgeekPrice ? Number(seatgeekPrice) : null,
          seatgeekUrl,
          stubhubPrice: stubhubPrice ? Number(stubhubPrice) : null,
          stubhubUrl,
          viagogoPrice: viagogoPrice ? Number(viagogoPrice) : null,
          viagogoUrl,
          isActive: Boolean(isActive),
        },
      });
      return NextResponse.json({ success: true, fixture: updated });
    }

    const created = await prisma.ticketFixture.create({
      data: {
        slug: normalizedSlug,
        title: title || `${homeTeam} vs ${awayTeam} Tickets`,
        homeTeam,
        awayTeam,
        sport,
        tournament,
        matchDate: matchDate || 'Saturday, Matchday',
        kickoffUtc: kickoffUtc || new Date().toISOString(),
        venueName: venueName || 'Official Stadium',
        city: city || 'London',
        country,
        venueCapacity: Number(venueCapacity),
        stadiumAddress: stadiumAddress || `${venueName}, ${city}`,
        minPrice: Number(minPrice),
        maxPrice: Number(maxPrice),
        currency,
        availableTickets: Number(availableTickets),
        demandStatus,
        featuredImage,
        seatgeekPrice: seatgeekPrice ? Number(seatgeekPrice) : Number(minPrice) + 15,
        seatgeekUrl: seatgeekUrl || `https://seatgeek.com/search?search=${encodeURIComponent(title || `${homeTeam} vs ${awayTeam}`)}&ref=ticketfixture`,
        stubhubPrice: stubhubPrice ? Number(stubhubPrice) : Number(minPrice),
        stubhubUrl: stubhubUrl || `https://stubhub.com/search?q=${encodeURIComponent(title || `${homeTeam} vs ${awayTeam}`)}&ref=ticketfixture`,
        viagogoPrice: viagogoPrice ? Number(viagogoPrice) : Number(minPrice) + 10,
        viagogoUrl: viagogoUrl || `https://viagogo.com/search?q=${encodeURIComponent(title || `${homeTeam} vs ${awayTeam}`)}&ref=ticketfixture`,
        isActive: Boolean(isActive),
      },
    });

    return NextResponse.json({ success: true, fixture: created });
  } catch (error: any) {
    console.error('Error saving ticket fixture:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove ticket fixture
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing ticket ID' }, { status: 400 });
    }

    await prisma.ticketFixture.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting ticket fixture:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
