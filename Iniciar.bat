@echo off
chcp 65001 >nul
title Maison du Pain
cd /d "%~dp0"
set "PATH=C:\Program Files\nodejs;%PATH%"

if not exist node_modules (
  echo Instalando dependencias, aguarde...
  call npm install
)

echo Iniciando em http://localhost:3000 ...
start "" /b cmd /c "timeout /t 6 >nul & start http://localhost:3000"
call npm run dev
pause
