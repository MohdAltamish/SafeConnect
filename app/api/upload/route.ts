import { NextRequest, NextResponse } from 'next/server';
import { getAdminStorage } from '@/lib/firebase/admin';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs/promises';

export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Size validation
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds maximum allowed limit of 5MB' },
        { status: 400 }
      );
    }

    // MIME type validation
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WEBP, and PDF are allowed.' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
    const anonymizedFileName = `evidence_${Date.now()}_${crypto.randomBytes(6).toString('hex')}.${ext}`;

    // 1. Try Firebase Cloud Storage
    try {
      const storage = getAdminStorage();
      const bucket = storage.bucket();
      const [exists] = await bucket.exists();

      if (exists) {
        const fileRef = bucket.file(`evidence/${anonymizedFileName}`);
        await fileRef.save(buffer, {
          metadata: {
            contentType: file.type,
          },
        });

        // Generate signed URL valid for 7 days
        const [signedUrl] = await fileRef.getSignedUrl({
          action: 'read',
          expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        });

        return NextResponse.json({
          url: signedUrl,
          fileName: anonymizedFileName,
          size: file.size,
          mimeType: file.type,
        });
      }
    } catch {
      // Firebase Storage bucket not available, proceed to server fallback
    }

    // 2. Server local storage fallback
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'evidence');
    await fs.mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, anonymizedFileName);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/evidence/${anonymizedFileName}`;

    return NextResponse.json({
      url: publicUrl,
      fileName: anonymizedFileName,
      size: file.size,
      mimeType: file.type,
    });
  } catch (error) {
    console.error('[Upload Error]:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'File upload failed' },
      { status: 500 }
    );
  }
}

