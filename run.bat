@echo off
chcp 65001 >nul
title SKULL KING MULTIJUGADOR

echo ================================================================
echo          🏴‍☠️ JUEGO SKULL KING - MULTIJUGADOR PIRATA 🏴‍☠️
echo          http://192.168.0.11:5173/
echo ================================================================
echo.

REM Obtener la direccion IP local en la red WiFi o Ethernet
for /f "usebackq tokens=*" %%i in (`powershell -NoProfile -Command "(Get-NetIPAddress -AddressFamily IPv4 | Where-Object IPAddress -match '^(192\.168\.|10\.|172\.)' | Select-Object -ExpandProperty IPAddress -First 1)"`) do set "LOCAL_IP=%%i"

if "%LOCAL_IP%"=="" set "LOCAL_IP=localhost"

echo [*] Tu direccion IP en la red WiFi es: %LOCAL_IP%
echo.
echo ================================================================
echo   1. Para jugar en ESTA LAPTOP:
echo      --> http://localhost:5173/
echo.
echo   2. Para jugar desde OTRAS LAPTOPS o CELULARES en tu mismo WiFi:
echo      --> http://%LOCAL_IP%:5173/
echo ================================================================
echo.
echo Iniciando Servidor Backend (NodeJS :4000)...
start "SKULL KING - BACKEND (:4000)" cmd /k "cd /d c:\2026\Juego Skull King\server && npm start"

echo Iniciando Cliente Frontend (ReactJS Vite :5173)...
start "SKULL KING - FRONTEND (:5173)" cmd /k "cd /d c:\2026\Juego Skull King\client && npm run dev -- --host 0.0.0.0"

exit
