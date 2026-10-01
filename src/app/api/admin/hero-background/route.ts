import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sanitizePlainText } from '@/lib/sanitize';

export const dynamic = 'force-dynamic';

async function checkAdminAuth() {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role;
  return userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';
}

export async function GET() {
  try {
    const isAuthorized = await checkAdminAuth();
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const [setting, scenes] = await Promise.all([
      prisma.systemSetting.findUnique({
        where: { id: 'global' },
      }),
      prisma.heroScene.findMany({
        orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      }),
    ]);

    const settings = {
      heroOpacity: setting?.heroOpacity ?? 80,
      heroKenBurns: setting?.heroKenBurns ?? true,
      heroCycleSeconds: setting?.heroCycleSeconds ?? 7,
      heroBeamsEnabled: setting?.heroBeamsEnabled ?? true,
      heroRadarEnabled: setting?.heroRadarEnabled ?? true,
      heroScoreTicker: setting?.heroScoreTicker ?? true,
    };

    return NextResponse.json({
      success: true,
      settings,
      scenes,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Update global hero settings (Opacity, Motion, Cycle Time, Stadium Beams, Laser Scan)
export async function PUT(request: NextRequest) {
  try {
    const isAuthorized = await checkAdminAuth();
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const {
      heroOpacity,
      heroKenBurns,
      heroCycleSeconds,
      heroBeamsEnabled,
      heroRadarEnabled,
      heroScoreTicker,
    } = body;

    const updated = await prisma.systemSetting.upsert({
      where: { id: 'global' },
      update: {
        ...(heroOpacity !== undefined && { heroOpacity: Math.min(100, Math.max(10, Number(heroOpacity))) }),
        ...(heroKenBurns !== undefined && { heroKenBurns: Boolean(heroKenBurns) }),
        ...(heroCycleSeconds !== undefined && { heroCycleSeconds: Math.max(3, Number(heroCycleSeconds)) }),
        ...(heroBeamsEnabled !== undefined && { heroBeamsEnabled: Boolean(heroBeamsEnabled) }),
        ...(heroRadarEnabled !== undefined && { heroRadarEnabled: Boolean(heroRadarEnabled) }),
        ...(heroScoreTicker !== undefined && { heroScoreTicker: Boolean(heroScoreTicker) }),
      },
      create: {
        id: 'global',
        heroOpacity: heroOpacity !== undefined ? Math.min(100, Math.max(10, Number(heroOpacity))) : 80,
        heroKenBurns: heroKenBurns !== undefined ? Boolean(heroKenBurns) : true,
        heroCycleSeconds: heroCycleSeconds !== undefined ? Math.max(3, Number(heroCycleSeconds)) : 7,
        heroBeamsEnabled: heroBeamsEnabled !== undefined ? Boolean(heroBeamsEnabled) : true,
        heroRadarEnabled: heroRadarEnabled !== undefined ? Boolean(heroRadarEnabled) : true,
        heroScoreTicker: heroScoreTicker !== undefined ? Boolean(heroScoreTicker) : true,
      },
    });

    return NextResponse.json({
      success: true,
      settings: {
        heroOpacity: updated.heroOpacity,
        heroKenBurns: updated.heroKenBurns,
        heroCycleSeconds: updated.heroCycleSeconds,
        heroBeamsEnabled: updated.heroBeamsEnabled,
        heroRadarEnabled: updated.heroRadarEnabled,
        heroScoreTicker: updated.heroScoreTicker,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Create or update a superstar scene
export async function POST(request: NextRequest) {
  try {
    const isAuthorized = await checkAdminAuth();
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const {
      id,
      name,
      nickname,
      sport,
      team,
      tournament,
      poseTitle,
      poseDescription,
      statBadge,
      accentColor,
      borderGlow,
      image,
      videoUrl,
      ticketSlug,
      order,
      isActive,
      matchCompetition,
      matchMinuteOrOver,
      matchHomeTeam,
      matchAwayTeam,
      matchScore,
      matchLiveAction,
    } = body;

    if (!name || !image || !poseTitle) {
      return NextResponse.json(
        { error: 'Player name, image URL, and pose title are required.' },
        { status: 400 }
      );
    }

    const payload = {
      name: sanitizePlainText(name),
      nickname: nickname ? sanitizePlainText(nickname) : null,
      sport: sport ? sanitizePlainText(sport) : 'football',
      team: team ? sanitizePlainText(team) : 'Top Club',
      tournament: tournament ? sanitizePlainText(tournament) : 'World League',
      poseTitle: sanitizePlainText(poseTitle),
      poseDescription: poseDescription ? sanitizePlainText(poseDescription) : '',
      statBadge: statBadge ? sanitizePlainText(statBadge) : 'Superstar 🏆',
      accentColor: accentColor || 'from-sky-500 via-teal-400 to-emerald-500',
      borderGlow: borderGlow || 'shadow-sky-500/30 border-sky-500/40',
      image: sanitizePlainText(image),
      videoUrl: videoUrl ? sanitizePlainText(videoUrl) : null,
      ticketSlug: ticketSlug ? sanitizePlainText(ticketSlug) : 'arsenal-vs-chelsea',
      order: order !== undefined ? Number(order) : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      matchCompetition: matchCompetition ? sanitizePlainText(matchCompetition) : null,
      matchMinuteOrOver: matchMinuteOrOver ? sanitizePlainText(matchMinuteOrOver) : "75' IN-PLAY",
      matchHomeTeam: matchHomeTeam ? sanitizePlainText(matchHomeTeam) : 'HOME',
      matchAwayTeam: matchAwayTeam ? sanitizePlainText(matchAwayTeam) : 'AWAY',
      matchScore: matchScore ? sanitizePlainText(matchScore) : '1 - 0',
      matchLiveAction: matchLiveAction ? sanitizePlainText(matchLiveAction) : null,
    };

    let scene;
    if (id) {
      scene = await prisma.heroScene.update({
        where: { id },
        data: payload,
      });
    } else {
      scene = await prisma.heroScene.create({
        data: payload,
      });
    }

    return NextResponse.json({ success: true, scene });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Quick toggle active state or update order
export async function PATCH(request: NextRequest) {
  try {
    const isAuthorized = await checkAdminAuth();
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { id, isActive, order } = body;

    if (!id) {
      return NextResponse.json({ error: 'Scene ID required' }, { status: 400 });
    }

    const updated = await prisma.heroScene.update({
      where: { id },
      data: {
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(order !== undefined && { order: Number(order) }),
      },
    });

    return NextResponse.json({ success: true, scene: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Delete scene
export async function DELETE(request: NextRequest) {
  try {
    const isAuthorized = await checkAdminAuth();
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Scene ID required' }, { status: 400 });
    }

    await prisma.heroScene.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Hero scene deleted.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
