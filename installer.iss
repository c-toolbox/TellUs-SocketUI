[Setup]
AppName=SocketUI
AppVersion=1.0
DefaultDirName={autopf}\SocketUI
DefaultGroupName=SocketUI
OutputDir=.
OutputBaseFilename=SocketUI-Installer
Compression=lzma
SolidCompression=yes
ArchitecturesInstallIn64BitMode=x64
PrivilegesRequired=lowest
SetupIconFile=SocketUI\icon.ico

[Files]
Source: "SocketUI\*"; DestDir: "{app}"; Flags: recursesubdirs createallsubdirs

[Icons]
Name: "{group}\SocketUI"; Filename: "{app}\SocketUI.exe"

[Tasks]
Name: "startup"; Description: "Start SocketUI when Windows starts"; Flags: unchecked

[Registry]
Root: HKCU; Subkey: "Software\Microsoft\Windows\CurrentVersion\Run"; \
    ValueType: string; ValueName: "SocketUI"; ValueData: """{app}\SocketUI.exe"""; \
    Tasks: startup; Flags: uninsdeletevalue

[Run]
Filename: "{app}\SocketUI.exe"; Description: "Launch SocketUI"; Flags: nowait postinstall skipifsilent
