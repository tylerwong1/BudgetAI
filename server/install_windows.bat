@echo off

REM Run this script in CMD (not Powershell)!

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Python is not installed. Please install Python first.
    exit /b
)

REM Create virtual environment
python -m venv venv
if errorlevel 1 (
    echo Failed to create virtual environment.
    exit /b
)

REM Activate virtual environment
call venv\Scripts\activate
if errorlevel 1 (
    echo Failed to activate virtual environment.
    exit /b
)

REM Install requirements
if exist requirements.txt (
    pip install -r requirements.txt
    if errorlevel 1 (
        echo Failed to install requirements.
        exit /b
    )
    echo Dependencies installed successfully.
) else (
    echo requirements.txt not found.
)
