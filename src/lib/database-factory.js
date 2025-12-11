// Database factory that chooses the appropriate database implementation
// based on the deployment environment

import { initializeDatabase as initSQLite, getDatabase as getSQLite, closeDatabase as closeSQLite } from './database.js';
import { initializeDatabase as initMemory, getDatabase as getMemory, closeDatabase as closeMemory } from './database-vercel.js';

// Determine if we're in a Vercel environment
const isVercelEnvironment = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

// Initialize the appropriate database
function initializeDatabase() {
    if (isVercelEnvironment) {
        console.log('Initializing in-memory database for Vercel deployment');
        return initMemory();
    } else {
        console.log('Initializing SQLite database for local development');
        return initSQLite();
    }
}

// Get the appropriate database instance
function getDatabase() {
    if (isVercelEnvironment) {
        return getMemory();
    } else {
        return getSQLite();
    }
}

// Close the appropriate database connection
function closeDatabase() {
    if (isVercelEnvironment) {
        return closeMemory();
    } else {
        return closeSQLite();
    }
}

export {
    initializeDatabase,
    getDatabase,
    closeDatabase
};