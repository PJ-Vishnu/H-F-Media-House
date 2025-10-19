
import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';
import type { PortfolioItem } from '@/modules/portfolio/portfolio.schema';
import fs from 'fs';
import path from 'path';
import { verifyAuth } from '@/lib/auth';
import { cookies } from 'next/headers';


// GET /api/portfolio
export async function GET() {
  try {
    const data = await db.getPortfolio();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch portfolio:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/portfolio
export async function POST(req: Request) {
    const token = cookies().get('user-token')?.value;
    if (!token || !(await verifyAuth(token))) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    try {
        const body = await req.json();
        const newItem = await db.addPortfolioItem(body);
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        console.error('Failed to add portfolio item:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// PUT /api/portfolio?id=...
export async function PUT(req: NextRequest) {
    const token = cookies().get('user-token')?.value;
    if (!token || !(await verifyAuth(token))) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    try {
        const id = req.nextUrl.searchParams.get('id');
        if (!id) {
            return NextResponse.json({ message: 'Item ID is required' }, { status: 400 });
        }
        const body: Partial<PortfolioItem> = await req.json();
        const updatedItem = await db.updatePortfolioItem(id, body);
        return NextResponse.json(updatedItem, { status: 200 });
    } catch (error) {
        console.error('Failed to update portfolio item:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE /api/portfolio?id=...
export async function DELETE(req: NextRequest) {
    const token = cookies().get('user-token')?.value;
    if (!token || !(await verifyAuth(token))) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    try {
        const id = req.nextUrl.searchParams.get('id');
        if (!id) {
            return NextResponse.json({ message: 'Item ID is required' }, { status: 400 });
        }
        
        const itemToDelete = await db.getPortfolioItemById(id);

        await db.deletePortfolioItem(id);
        
        if (itemToDelete && itemToDelete.imageUrl) {
            const filePath = path.join(process.cwd(), 'public', itemToDelete.imageUrl);
            if (fs.existsSync(filePath) && !itemToDelete.imageUrl.startsWith('https://')) {
                try {
                    fs.unlinkSync(filePath);
                } catch (fileError) {
                    console.error(`Failed to delete file: ${filePath}`, fileError);
                }
            }
        }

        return NextResponse.json({ message: 'Item deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error("Failed to delete portfolio item:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
