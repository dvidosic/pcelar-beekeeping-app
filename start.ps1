$env:ANDROID_HOME = "D:\Android SDK"
$env:PATH = "$env:PATH;D:\Android SDK\platform-tools"
adb reverse tcp:8081 tcp:8081
npx expo start