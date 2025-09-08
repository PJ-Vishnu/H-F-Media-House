
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import bcryptjs from 'bcryptjs';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    const token = cookies().get('user-token')?.value;
    if (!token) {
        return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const verifiedUser = await verifyAuth(token);
    if (!verifiedUser || verifiedUser.role !== 'admin') {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    try {
        const { currentPassword, newPassword } = await req.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
        }

        const admin = await db.getAdmin();
        if (!admin || !admin.email || !admin.passwordHash) {
            return NextResponse.json({ message: 'Admin account not found' }, { status: 500 });
        }

        const isPasswordValid = await bcryptjs.compare(currentPassword, admin.passwordHash);

        if (!isPasswordValid) {
            return NextResponse.json({ message: 'Invalid current password' }, { status: 400 });
        }

        const newPasswordHash = await bcryptjs.hash(newPassword, 10);
        await db.updateAdminPassword(newPasswordHash);

        return NextResponse.json({ success: true, message: 'Password updated successfully' });

    } catch (error) {
        console.error('Change password error:', error);
        return NextResponse.json({ message: 'An internal error occurred' }, { status: 500 });
    }
}
