import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Please provide name, email, and password.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email address already exists.' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email: cleanEmail,
        password: hashedPassword,
        role: 'USER',
        isApproved: true,
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanEmail}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Account created successfully! You can now sign in.',
      userId: newUser.id,
    });
  } catch (error: any) {
    console.error('User registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to register account.' },
      { status: 500 }
    );
  }
}
