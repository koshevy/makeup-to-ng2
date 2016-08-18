const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const autoPrefixer = require('gulp-autoprefixer');
require('es6-promise').polyfill();
const cssComb = require('gulp-csscomb');
const cmq = require('gulp-merge-media-queries');
const frontnote = require('gulp-frontnote');
const cleanCss = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const imageMin = require('gulp-imagemin');
const svgmin = require('gulp-svgmin');
const cache = require('gulp-cache');
const svgicons2svgfont = require('gulp-svgicons2svgfont');
const iconfont = require('gulp-iconfont');
const iconfontCss = require('gulp-iconfont-css');
const consolidate = require('gulp-consolidate');
const notify = require('gulp-notify');

const
  // set name of your symbol font
  fontName = 'icon-fonts',
  // set class name in your CSS
  className = 'icon',
	/**
	 * Recommended to get consistent builds when watching files
	 * See https://github.com/nfroidure/gulp-iconfont
	*/
  timestamp = Math.round(Date.now() / 1000);


const PATHS = {
  src: 'app/src/',
  dist: 'app/dist/'
};

  gulp.task("build:icons", () => 
	  gulp.src([PATHS.src + 'fonts/svg-src/*.svg'])
	  	.pipe(svgmin())
	  	.pipe(gulp.dest(PATHS.src + 'fonts/svg-src/'))
	    .pipe(iconfont({
	      fontName,
	      formats: ['ttf', 'eot', 'woff', 'woff2', 'svg'],
	      prependUnicode: true,
	      timestamp
	    }))
	    .on('glyphs', (glyphs) => {
	      const options = {
	        className,
	        fontName,
	        fontPath: 'icons/', // set path to font (from your CSS file if relative)
	        glyphs: glyphs.map(mapGlyphs)
	      }
	      gulp.src(PATHS.src + 'styles/style-guide/_icons.scss')
	        .pipe(consolidate('lodash', options))
	        .pipe(rename({ basename: fontName }))
	        .pipe(sass())
	        .pipe(gulp.dest(PATHS.dist + 'fonts/')) // set path to export your CSS

	      gulp.src(PATHS.src + 'styles/style-guide/icon-fonts-source.html')
	        .pipe(consolidate('lodash', options))
	        .pipe(rename({ basename: 'index' }))
	        .pipe(gulp.dest(PATHS.dist + 'fonts/')) // set path to export your sample HTML
	    })
	    .pipe(gulp.dest(PATHS.dist + 'fonts/icons/')) // set path to export your fonts
	    .pipe(notify(fontName + ' compile'))
	);
    

function mapGlyphs(glyph) {
  return { name: glyph.name, codepoint: glyph.unicode[0].charCodeAt(0) }
}