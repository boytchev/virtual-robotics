call rollup src\virtual-robotics.js --file build\bundle.js  --validate

misc\jsmin\jsmin <build\bundle.js >build\virtual-robotics.js "Virtual Robotics (+ Three.js + Cannon-ES.js)"

del build\bundle.js

pause
