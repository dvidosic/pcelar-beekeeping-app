$env:ANDROID_HOME = "D:\Android SDK"
$env:PATH = "$env:PATH;D:\Android SDK\platform-tools;D:\Android SDK\cmdline-tools\latest\bin"
Write-Host "Uninstalling old version..."
adb uninstall com.pcelar.app
Write-Host "Building release APK..."
npx expo run:android --variant release
Write-Host "Done! APK installed on phone."