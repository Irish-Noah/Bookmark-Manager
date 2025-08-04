## Bookmark Manager Project
I want to keep my skills sharp and explore new stacks, so this is my second attempt a project using a new stack! 

Goal: A simple checklist that persists data between sessions and database connections

### Stack: 
- JavaScript (Node.js + Express)
- MongoDB (local)
- Swagger

 ### Project Breakdown:
- app.js -> Entry point for the app, sets up server and database
- swagger.js -> Setup swagger page to be served in app.js
- routes/bookmarks.js -> Determine routes for bookmark related endpoints
- models/Bookmark.js -> Mongoose schema for a bookmark
- docs/swagger.yaml -> Schemas for Swagger to interact with

### Project Accomplishments
- Users can read, add, update, and delete their bookmarks from the MongoDB
- Request handling with Express validation
