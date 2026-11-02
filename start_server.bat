@echo off
title Digital Logic Simulator Server
echo Starting server at http://localhost:8080/ ...
start http://localhost:8080/
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause

