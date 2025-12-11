// Alternative database implementation for Vercel deployment
// This uses a simple in-memory storage for demonstration purposes
// In production, you should use Vercel's KV storage or a managed database

let memoryDB = [];
let nextId = 1;

// Initialize the database
function initializeDatabase() {
    console.log('Using in-memory database for Vercel deployment');
}

// Function to get database instance
function getDatabase() {
    return {
        prepare: (query) => {
            return {
                run: (...params) => {
                    if (query.includes('INSERT INTO feedback')) {
                        const newEntry = {
                            id: nextId++,
                            name: params[0],
                            room_number: params[1],
                            category: params[2],
                            rating: params[3],
                            description: params[4],
                            status: 'open',
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        };
                        memoryDB.push(newEntry);
                        return { lastInsertRowid: newEntry.id };
                    }
                    else if (query.includes('UPDATE feedback')) {
                        const id = params[1];
                        const status = params[0];
                        const entry = memoryDB.find(item => item.id === id);
                        if (entry) {
                            entry.status = status;
                            entry.updated_at = new Date().toISOString();
                            return { changes: 1 };
                        }
                        return { changes: 0 };
                    }
                    return { changes: 0 };
                },
                all: () => {
                    if (query.includes('SELECT * FROM feedback')) {
                        return memoryDB.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    }
                    return [];
                }
            };
        },
        exec: (query) => {
            // For table creation, we don't need to do anything in memory
            console.log('Executing query (no-op in memory):', query);
        }
    };
}

// Close database connection
function closeDatabase() {
    console.log('Database connection closed');
}

export {
    initializeDatabase,
    getDatabase,
    closeDatabase
};