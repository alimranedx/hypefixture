import { NextResponse } from 'next/server';
import { getActiveSports } from '@/lib/sports';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export async function GET() {
  try {
    const sports = await getActiveSports();
    return NextResponse.json({
      success: true,
      sports,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to fetch sports',
        sports: [],
      },
      { status: 500 }
    );
  }
}
