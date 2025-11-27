import { NextResponse } from 'next/server';
import { StorageService } from '../../../../lib/storage';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { auth } from '@/auth';

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('image') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const extension = file.name.split('.').pop();
        const fileName = `${format(new Date(), 'yyyyMMdd')}_${uuidv4()}.${extension}`;
        const filePath = `images/${format(new Date(), 'yyyy/MM')}/${fileName}`;

        const publicUrl = await StorageService.save(filePath, buffer, file.type);

        return NextResponse.json({ url: publicUrl });
    } catch (error) {
        console.error('Error uploading image:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
