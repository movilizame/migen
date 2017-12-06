# Mobile Icon GENerator (migen)
A node.js command line to generate icon files for a mobile app 

# Install

````
npm install -g @movilizame/mobile-icon-generator
````

# Usage

For icon use the following commands with an image 1024x1024.

````
migen -s ios ../mobile-icon-generator/icon.png
````

or


````
migen -s android ../mobile-icon-generator/icon.png
````


For splash-screen use the following commands with an image 5000x5000 with the app logo center. 

````
migen -s ios-screen ../mobile-icon-generator/icon.png
````

or


````
migen -s android-screen ../mobile-icon-generator/icon.png
````