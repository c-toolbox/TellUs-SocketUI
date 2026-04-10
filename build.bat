@echo off
setlocal


echo === Building SocketUI Frontend ===

if exist SocketUI rmdir /s /q SocketUI
if exist SocketUI.zip del SocketUI.zip

cd frontend
call npm install
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] npm build failed.
    exit /b %errorlevel%
)
cd ..


echo.
echo === Copying frontend dist to backend ===

if exist backend\dist rmdir /s /q backend\dist
xcopy "frontend\dist" "backend\dist" /E /I /Y


echo.
echo === Installing Python dependencies ===

cd backend
pip install -r requirements.txt


echo.
echo === Building executable ===

python -m PyInstaller server.py ^
 --onefile ^
 --noconsole ^
 --name SocketUI ^
 --add-data "dist;dist" ^
 --icon dist\icon.ico ^
 --distpath ..\SocketUI ^
 --workpath build

if %errorlevel% neq 0 (
    echo [ERROR] PyInstaller build failed.
    exit /b %errorlevel%
)

cd ..


echo.
echo === Creating zip ===

powershell -command "Compress-Archive -Path 'SocketUI\*' -DestinationPath 'SocketUI.zip'"


echo.
echo === Build Complete ===
