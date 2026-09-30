import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sanitizePlainText } from '@/lib/sanitize';

const DEFAULT_SPORTS = [
  { name: 'Football (Soccer)', slug: 'football', icon: '⚽', description: 'Premier League, UEFA Champions League, La Liga, Serie A', isActive: true, order: 1 },
  { name: 'NBA Basketball', slug: 'nba', icon: '🏀', description: 'NBA Regular Season, Playoffs, Finals & In-Season Tournament', isActive: true, order: 2 },
  { name: 'NFL American Football', slug: 'nfl', icon: '🏈', description: 'Sunday Night Football, RedZone, Playoffs & Super Bowl', isActive: true, order: 3 },
  { name: 'UFC & Boxing', slug: 'ufc', icon: '🥊', description: 'UFC PPV Main Cards, Championship Boxing & Fight Nights', isActive: true, order: 4 },
  { name: 'Cricket', slug: 'cricket', icon: '🏏', description: 'IPL, ICC World Cup, Test Matches & T20 Leagues', isActive: false, order: 5 },
  { name: 'Formula 1', slug: 'f1', icon: '🏎️', description: 'F1 Grand Prix Races, Qualifying & Sprint Weekends', isActive: false, order: 6 },
  { name: 'Tennis', slug: 'tennis', icon: '🎾', description: 'Grand Slams, Wimbledon, US Open, Roland Garros & ATP Tour', isActive: false, order: 7 },
  { name: 'MLB Baseball', slug: 'mlb', icon: '⚾', description: 'Major League Baseball, World Series & MLB TV', isActive: false, order: 8 },
];

async function syncSystemSettingActiveSports() {
  try {
    const active = await prisma.sportCategory.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: { slug: true },
    });
    const activeStr = active.map((s) => s.slug).join(',');
    await prisma.systemSetting.upsert({
      where: { id: 'global' },
      update: { activeSports: activeStr },
      create: { id: 'global', activeSports: activeStr },
    });
  } catch (err) {
    console.warn('Could not sync activeSports in systemSetting:', err);
  }
}

export async function GET() {
  try {
    let sports = await prisma.sportCategory.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });

    // Seed defaults if empty
    if (sports.length === 0) {
      for (const s of DEFAULT_SPORTS) {
        await prisma.sportCategory.create({ data: s });
      }
      sports = await prisma.sportCategory.findMany({
        orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      });
      await syncSystemSettingActiveSports();
    }

    return NextResponse.json({ success: true, sports });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const body = await request.json();
    const { id, name, slug, icon, description, isActive, order } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Sport name is required' }, { status: 400 });
    }

    const cleanName = sanitizePlainText(name);
    let cleanSlug = (slug || cleanName).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    if (!cleanSlug) cleanSlug = `sport-${Date.now()}`;

    let result;
    if (id) {
      // Update
      result = await prisma.sportCategory.update({
        where: { id },
        data: {
          name: cleanName,
          slug: cleanSlug,
          icon: icon ? sanitizePlainText(icon) : '🏆',
          description: description ? sanitizePlainText(description) : null,
          isActive: isActive !== undefined ? Boolean(isActive) : undefined,
          order: order !== undefined ? Number(order) : undefined,
        },
      });
    } else {
      // Create - check uniqueness
      const existing = await prisma.sportCategory.findUnique({ where: { slug: cleanSlug } });
      if (existing) {
        cleanSlug = `${cleanSlug}-${Date.now().toString().slice(-4)}`;
      }

      result = await prisma.sportCategory.create({
        data: {
          name: cleanName,
          slug: cleanSlug,
          icon: icon ? sanitizePlainText(icon) : '🏆',
          description: description ? sanitizePlainText(description) : null,
          isActive: isActive !== undefined ? Boolean(isActive) : true,
          order: order !== undefined ? Number(order) : 0,
        },
      });
    }

    await syncSystemSettingActiveSports();

    return NextResponse.json({ success: true, sport: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { id, isActive, order, name, icon } = body;

    if (!id) {
      return NextResponse.json({ error: 'Sport ID required' }, { status: 400 });
    }

    const updated = await prisma.sportCategory.update({
      where: { id },
      data: {
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(order !== undefined && { order: Number(order) }),
        ...(name && { name: sanitizePlainText(name) }),
        ...(icon && { icon: sanitizePlainText(icon) }),
      },
    });

    await syncSystemSettingActiveSports();

    return NextResponse.json({ success: true, sport: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Sport ID required' }, { status: 400 });
    }

    await prisma.sportCategory.delete({ where: { id } });
    await syncSystemSettingActiveSports();

    return NextResponse.json({ success: true, message: 'Sport category deleted.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
