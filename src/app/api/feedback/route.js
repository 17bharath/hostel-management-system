import { NextResponse } from "next/server";
import { initializeDatabase, getDatabase } from '@/lib/database';

// Initialize database on module load
initializeDatabase();

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, room_number, category, rating, description } = body;

        console.log("Feedback:", body);

        const db = getDatabase();

        // Insert feedback into database
        const stmt = db.prepare(`
            INSERT INTO feedback (name, room_number, category, rating, description)
            VALUES (?, ?, ?, ?, ?)
        `);

        const result = stmt.run(name, room_number, category, rating, description);

        return NextResponse.json({
            message: "Feedback submitted successfully ✅",
            id: result.lastInsertRowid
        });
    } catch (error) {
        console.error('Error saving feedback:', error);
        return NextResponse.json(
            { error: 'Failed to save feedback' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const db = getDatabase();

        // Get all feedback from database
        const stmt = db.prepare(`
            SELECT * FROM feedback ORDER BY created_at DESC
        `);

        const feedback = stmt.all();

        return NextResponse.json(feedback);
    } catch (error) {
        console.error('Error fetching feedback:', error);
        return NextResponse.json(
            { error: 'Failed to fetch feedback' },
            { status: 500 }
        );
    }
}
