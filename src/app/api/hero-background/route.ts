import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [setting, scenes] = await Promise.all([
      prisma.systemSetting.findUnique({
        where: { id: 'global' },
        select: {
          heroOpacity: true,
          heroKenBurns: true,
          heroCycleSeconds: true,
          heroBeamsEnabled: true,
          heroRadarEnabled: true,
          heroScoreTicker: true,
        },
      }),
      prisma.heroScene.findMany({
        where: { isActive: true },
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
    console.error('Error fetching hero background configuration:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        settings: {
          heroOpacity: 80,
          heroKenBurns: true,
          heroCycleSeconds: 7,
          heroBeamsEnabled: true,
          heroRadarEnabled: true,
          heroScoreTicker: true,
        },
        scenes: [],
      },
      { status: 500 }
    );
  }
}
