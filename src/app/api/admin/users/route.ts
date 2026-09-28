import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET list of admins for Super Admin
export async function GET() {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role;

  if (userRole !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized. Super Admin access required.' }, { status: 403 });
  }

  const admins = await prisma.user.findMany({
    where: {
      role: { in: ['ADMIN', 'SUPER_ADMIN'] },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isApproved: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ admins });
}

// POST: Toggle approve status or delete
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role;

  if (userRole !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized. Super Admin access required.' }, { status: 403 });
  }

  const { adminId, action } = await request.json();

  if (!adminId) {
    return NextResponse.json({ error: 'Admin ID is required' }, { status: 400 });
  }

  const targetUser = await prisma.user.findUnique({ where: { id: adminId } });
  if (!targetUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (targetUser.role === 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Super Admin permissions cannot be modified.' }, { status: 400 });
  }

  if (action === 'APPROVE') {
    const updated = await prisma.user.update({
      where: { id: adminId },
      data: { isApproved: true },
    });
    return NextResponse.json({ success: true, message: `Approved admin ${updated.email}!`, user: updated });
  } else if (action === 'REVOKE') {
    const updated = await prisma.user.update({
      where: { id: adminId },
      data: { isApproved: false },
    });
    return NextResponse.json({ success: true, message: `Revoked access for ${updated.email}!`, user: updated });
  } else if (action === 'DELETE') {
    await prisma.user.delete({ where: { id: adminId } });
    return NextResponse.json({ success: true, message: 'Admin account deleted.' });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
