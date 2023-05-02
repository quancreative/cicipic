https://www.electronjs.org/docs/latest/tutorial/tutorial-packaging

npm config get registry

delete package-lock.json
npm cache clear --force
npm cache verify
npm install [module]

##Develop
npm run dev

###Debug
chrome://inspect/#devices

%AppData%\Roaming\CeliaPhoto\log.log
C:\Users\Quan\AppData\Roaming\CeliaPhoto\logs

By default, it writes logs to the following locations:

on Linux: ~/.config/{app name}/logs/{process type}.log
on macOS: ~/Library/Logs/{app name}/{process type}.log
on Windows: %USERPROFILE%\AppData\Roaming\{app name}\logs\{process type}.log

###Creating a distributable
npm run make

###Note
File Associations
https://www.electron.build/generated/platformspecificbuildoptions

####Credits
https://github.com/aesqe/electron-image-viewer
https://gitlab.com/karaokemugen/code/karaokemugen-app