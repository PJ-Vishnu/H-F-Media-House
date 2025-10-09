
import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';
import type { Service } from '@/modules/services/services.schema';
import fs from 'fs';
import path from 'path';

// GET /api/services
export async function GET() {
  try