import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';
import type { PortfolioItem } from '@/modules/portfolio/portfolio.schema';

// GET /api/portfolio
export async function GET() {
  try {
    const data = await db.getPortfolio();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/portfolio
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const newItem = await db.addPortfolioItem(body);
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// PUT /api/portfolio?id=...
export async function PUT(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ message: 'Item ID is required' }, { status: 400 });
        }
        const body: Partial<PortfolioItem> = await req.json();
        const updatedItem = await db.updatePortfolioItem(id, body);
        return NextResponse.json(updatedItem, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE /api/portfolio?id=...
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ message: 'Item ID is required' }, { status: 400 });
        }
        await db.deletePortfolioItem(id);
        return NextResponse.json({ message: 'Item deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
