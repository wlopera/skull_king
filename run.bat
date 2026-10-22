```bat
@echo off

REM ==========================================
REM   JUEGO DOMINO - WLOPERA
REM   Iniciar Backend + Frontend
REM ==========================================

REM --- Backend ---
start "DOMINO BACKEND" cmd /k "cd /d c:\2026\Juego Skull King\server && npm start"

REM --- Frontend ---
start "DOMINO FRONTEND" cmd /k "cd /d C:\2026\Juego Skull King\client && npm run dev"

REM --- Git Bash --- 
rem start "DOMINO GIT BASH" "C:\Program Files\Git\git-bash.exe" --cd="C:\2026\Juego Domino"

exit
```
