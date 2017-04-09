# Pomodoro-NW   ![Travis CI](https://travis-ci.org/0000marcell/Pomodoro-NW.svg?branch=master "Travis CI")  ![code climate](https://codeclimate.com/github/0000marcell/Pomodoro-NW/badges/gpa.svg "code climate") ![code covarage](https://codeclimate.com/github/0000marcell/Pomodoro-NW/badges/coverage.svg "code covarage")

Download http://0000marcell.github.io/Pomodoro-NW/

Simple pomodoro tracker app for mac, linux and windows made using web technologies:
* ember
* handlebars
* NW.js
* Node.js
the app can be packed to any of the systems mentioned using nw.js (A.K.A nodewebkit) 
i've also used flipclock http://flipclockjs.com/

To compile for development change the enviroment variable in public/js/app.js to 'development'
and the devMode variable to true
then run `npm run build` or `npm run test` 

To compile for production change the 'devMod' variable in public/js/app.js to false 
then run `npm run build`

To compile the app for a specific OS run `grunt` the app will be compiled and copied to the build directory
you can change which OS the app is compiled to in the Gruntfile.js
