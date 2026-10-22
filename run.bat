@echo off
REM ==========================================
REM   JUEGO SKULL KING - WLOPERA
REM   Iniciar Backend (NodeJS) + Frontend (ReactJS)
REM ==========================================

REM --- Backend (NodeJS :4000) ---
start "SKULL KING BACKEND" cmd /k "cd /d c:\2026\Juego Skull King\server && npm start"

REM --- Frontend (ReactJS Vite :5173) ---
start "SKULL KING FRONTEND" cmd /k "cd /d c:\2026\Juego Skull King\client && npm run dev"

exit
