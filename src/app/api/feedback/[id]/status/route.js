import { NextResponse } from "next/server";
import { getDatabase } from '@/lib/database';

export async function PUT(req, { params }) {
    try {
        const { id } = await params;
        const { status } = await req.json();

        if (!status) {
            return NextResponse.json(
                { error: 'Status is required' },
                { status: 400 }
            );
        }

        const db = getDatabase();

        // Update feedback status in database
        const stmt = db.prepare(`
            UPDATE feedback 
            SET status = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `);

        const result = stmt.run(status, parseInt(id));

        if (result.changes === 0) {
            return NextResponse.json(
                { error: 'Feedback not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Status updated successfully ✅",
            id: parseInt(id),
            status: status
        });
    } catch (error) {
        console.error('Error updating status:', error);
        return NextResponse.json(
            { error: 'Failed to update status' },
            { status: 500 }
        );
    }
}