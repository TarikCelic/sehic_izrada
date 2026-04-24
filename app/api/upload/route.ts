import { auth } from '@/lib/auth';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  const isAdmin = (role: string) => {
    const adminRoles = ['Vlasnik', 'Programer', 'Moderator'];
    return adminRoles.includes(role);
  };

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const session = await auth();
        if (!session || !isAdmin(session.user.role)) {
          throw new Error('Unauthorized');
        }
        return {
          allowedContentTypes: [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
          ],
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('Slikana spremljena na Blob:', blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
