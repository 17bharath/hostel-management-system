# Vercel Deployment Guide

This document provides instructions for deploying the Duo Under Duo feedback system to Vercel.

## Overview

The project is a Next.js application with a feedback management system for a hostel. It includes:
- A feedback submission form
- A dashboard to view and manage feedback tickets
- API routes for handling feedback data

## Database Considerations

This project uses SQLite for local development and an in-memory database for Vercel deployment. 

### For Production Use

The in-memory database is suitable for demonstration purposes but will lose data between deployments. For production, consider these alternatives:

1. **Vercel KV (Redis)**
   - Add Vercel KV to your project
   - Replace the in-memory database with KV storage

2. **External Database Services**
   - PlanetScale (MySQL)
   - Supabase (PostgreSQL)
   - MongoDB Atlas

3. **Vercel Postgres**
   - Native PostgreSQL integration with Vercel

## Deployment Steps

1. **Push to GitHub**
   - Ensure your code is pushed to a GitHub repository

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables** (if needed)
   - Add any required environment variables in the Vercel dashboard

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application

## Post-Deployment Notes

- The application will use an in-memory database on Vercel
- Data will be reset when the deployment is updated
- For persistent data, implement one of the production database solutions mentioned above

## Local Development

To run the project locally:
```bash
npm install
npm run dev
```

The local development environment will use SQLite database with persistent storage.