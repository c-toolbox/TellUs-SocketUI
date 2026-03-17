@echo off
setlocal

:: 1. Build the React frontend
echo.
echo === Building React Frontend ===
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] npm build failed.
    exit /b %errorlevel%
)
cd ..

:: 2. Copy frontend build into backend
echo.
echo === Copying frontend dist to backend ===
if exist backend\dist rmdir /s /q backend\dist
xcopy "frontend\dist" "backend\dist" /E /I /Y

:: 3. Build backend executable
echo.
cd backend

echo === Installing Python dependencies ===
pip install -r requirements.txt

echo === Building executable ===
pyinstaller server.py ^
 --onefile ^
 --name SocketUI ^
 --add-data "dist;dist" ^
 --icon dist\icon.ico ^
 --distpath dist ^
 --workpath build

if %errorlevel% neq 0 (
    echo [ERROR] PyInstaller build failed.
    exit /b %errorlevel%
)

cd ..

:: 4. Create zip in root
echo.
echo === Creating zip ===
if exist SocketUI.zip del SocketUI.zip

powershell -command "Compress-Archive -Path 'backend\dist\*' -DestinationPath 'SocketUI.zip'"

echo.
echo === Build Complete ===