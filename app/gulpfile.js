const gulp = require('gulp');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
require('es6-promise').polyfill();
const cssComb = require('gulp-csscomb');
const cmq = require('gulp-merge-media-queries');
const postcss = require('gulp-postcss');
const pxtorem = require('postcss-pxtorem');
const frontnote = require('gulp-frontnote');
const cleanCss = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const imageMin = require('gulp-imagemin');
const svgmin = require('gulp-svgmin');
const svgSprite = require("gulp-svg-sprite");
const cache = require('gulp-cache');
const svgicons2svgfont = require('gulp-svgicons2svgfont');
const iconfont = require('gulp-iconfont');
const iconfontCss = require('gulp-iconfont-css');
const consolidate = require('gulp-consolidate');
const twig = require('gulp-twig');
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
  src: 'src/',
  dist: 'dist/'
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

  gulp.task('styles',() =>
	gulp.src([PATHS.src + 'components/**/*.scss', PATHS.src + 'styles/**/*.scss'])
		.pipe(sourcemaps.init())
		.pipe(sass.sync({
	      outputStyle: 'expanded',
	      precision: 10,
	    }).on('error', sass.logError))
		.pipe(postcss([
	      pxtorem({
	        propWhiteList: [
	          'font', 'font-size', 'line-height',
	          'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
	          'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
	          'left', 'right', 'top', 'bottom',
	          'width', 'height', 'min-width', 'max-width', 'max-height', 'min-height',
	          'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius',
	          'border-width', 'border-left-width', 'border-right-width', 'border-top-width', 'border-bottom-width', 'border'
	        ],
	      }),
	      autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}),
	    ]))
		
		// .pipe(cmq({log:true}))
		.pipe(concat('main.css'))
		.pipe(cssComb())
		.pipe(cleanCss())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(PATHS.dist + 'styles/'))
		.pipe(reload({stream:true}))
		.pipe(notify('css task finished'))
);

gulp.task('views',() =>
	gulp.src(PATHS.src + 'views/*.twig')
		.pipe(twig())
		.pipe(gulp.dest(PATHS.dist + '/views'))
		.pipe(notify('views compile'))
);

var config = {
  mode: {
    symbol: { // symbol mode to build the SVG
      dest: PATHS.dist + 'svg/sprites', // destination foldeer
      sprite: 'sprite.svg', //sprite name
      example: true // Build sample page
    }
  },
  svg: {
    xmlDeclaration: false, // strip out the XML attribute
    doctypeDeclaration: false // don't include the !DOCTYPE declaration
  }
};

gulp.task('build:sprites',() =>
	gulp.src(PATHS.src + 'icons/**/*.svg')
		.pipe(svgmin())
	    .pipe(svgSprite(config))
	    .pipe(gulp.dest('.'))
	    .pipe(notify('svg sprites compile'))
);
    
gulp.task('serve', ['styles', 'views'], () => {
  browserSync({
    notify: true,
    port: 9000,
    server: {
      baseDir: [PATHS.dist + 'views', PATHS.dist]
    }
  });

  gulp.watch([PATHS.src +'fonts/svg-src/'],['build:icons']).on('change', reload);
  gulp.watch([PATHS.src +'views/**/*.twig'], ['views']).on('change', reload);
  gulp.watch([PATHS.src +'icons/**/*.svg'], ['build:sprites']).on('change', reload);
  gulp.watch([PATHS.src +'styles/**/*.scss', PATHS.src +'/components/**/*.scss'], ['styles']);
  gulp.watch([PATHS.src +'fonts/svg-src/'], ['build:icons']);
});

function mapGlyphs(glyph) {
  return { name: glyph.name, codepoint: glyph.unicode[0].charCodeAt(0) }
}