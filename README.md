# Static Site Boilerplate

A Grunt-powered project to build up the scaffolding for static site assets.

## Features

* Automatically compress PNG, GIF, JPG, and SVG files when added to folder
* Automatic linting (via JSHint and CSSlint), concatenation, and minification of JS and CSS files
* SASS and Autoprefixer integration
* Browser auto-refresh on save (via Livereload plugin)

##**Prerequisites**

- [NodeJS](http://nodejs.org/) and NPM
- Grunt CLI (`npm install -g grunt`)
- [Livereload Plugins](http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions-) for Chrome, Firefox, and Safari (*Optional*)

## Running
1. Navigate to repo folder in terminal and run `npm install` (may need to `sudo npm install`)
2. Run `grunt` to start watching `src` directory for changes

## Notes

#### ***Compressing Images***

Placing any PNG, GIF, JPG, or SVG files into `images/_uncompressed` will create a compressed copy in `images/` and will also maintain directory hierarchy:

#####**Examples**

* `images/_uncompressed/image.png` --> `images/image.png`
* `images/_uncompressed/directory/image.png` --> `images/directory/image.png`


#### ***Using Minified CSS***

CSSMin/CSS-clean currently [strips out CSS sourcemap link comment](https://github.com/GoalSmashers/clean-css/issues/125#issuecomment-40404184) which can make debugging a little more difficult. Link to unminified version while in development, and then change link for production builds.

#### ***Linting/Concatenating/Minifying JS***
All files in `lib` folder are not part of the JS processing.
