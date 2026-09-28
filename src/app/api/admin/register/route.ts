import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Please provide all required fields: name, email, and password.' },
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

    const newAdmin = await prisma.user.create({
      data: {
        name,
        email: cleanEmail,
        password: hashedPassword,
        role: 'ADMIN',
        isApproved: false, // Must be approved by Super Admin
        image: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Account registered successfully! Your account is currently pending approval by the Super Admin before you can log in.',
      userId: newAdmin.id,
    });
  } catch (error: any) {
    console.error('Admin registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to register admin account.' },
      { status: 500 }
    );
  }
}
