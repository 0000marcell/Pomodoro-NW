# Pomodoro-NW   ![Travis CI](https://travis-ci.org/0000marcell/Pomodoro-NW.svg?branch=master "Travis CI")  ![code climate](https://codeclimate.com/github/0000marcell/Pomodoro-NW/badges/gpa.svg "code climate") ![code covarage](https://codeclimate.com/github/0000marcell/Pomodoro-NW/badges/coverage.svg "code covarage")

Simple pomodoro and task tracker app for mac, linux and windows made using web technologies:
* ember
* NW.js
the app can be packed to any of the systems mentioned using nw.js (A.K.A nodewebkit) 
I've also used flipclock http://flipclockjs.com/

# How to run in development mode
To compile for development change the enviroment variable in public/js/app.js to 'development'
and the devMode variable to true
```
npm run build
or
npm run test // to run the tests
```
**you can access the console in development mode by pressing command+option+i**
# How to run in production mode

To compile for production change the 'devMod' variable in public/js/app.js to false 
then run 
```
npm run build
```
To compile the app for a specific OS run `grunt` the app will be compiled and copied to the build directory
you can change which OS the app is compiled to, in the Gruntfile.js
