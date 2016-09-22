const gulp = require('gulp');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const fs = require('fs');
const cache = require('gulp-cache');
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
const imagemin = require('gulp-imagemin');
const svgmin = require('gulp-svgmin');
const svgSprite = require("gulp-svg-sprite");
const svgicons2svgfont = require('gulp-svgicons2svgfont');
const iconfont = require('gulp-iconfont');
const iconfontCss = require('gulp-iconfont-css');
const consolidate = require('gulp-consolidate');
const twig = require('gulp-twig');
const notify = require('gulp-notify');
const del = require('del');

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
	        fontPath: '../fonts/icons/', // set path to font (from your CSS file if relative)
	        glyphs: glyphs.map(mapGlyphs)
	      }
	      gulp.src(PATHS.src + 'styles/style-guide/_icons-source.scss')
	        .pipe(consolidate('lodash', options))
	        .pipe(rename({ basename: '_icons' }))
	        .pipe(gulp.dest(PATHS.src + 'styles/style-guide/')) // set path to export your CSS

	      gulp.src(PATHS.src + 'styles/style-guide/icon-fonts-source.html')
	        .pipe(consolidate('lodash', options))
	        .pipe(rename({ basename: 'index' }))
	        .pipe(gulp.dest(PATHS.dist + 'fonts/')) // set path to export your sample HTML
	    })
	    .pipe(gulp.dest(PATHS.dist + 'fonts/icons/')) // set path to export your fonts
	);

  gulp.task('styles',() =>
	gulp.src([PATHS.src + 'main.scss', PATHS.src + 'index.modules.scss'])
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		//.pipe(sourcemaps.init())
		.pipe(sass.sync({
	      outputStyle: 'expanded',
	      precision: 10,
	    }).on('error', console.error.bind(console)))
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
<<<<<<< HEAD
		//.pipe(concat('main.css'))
=======
		.pipe(concat('main.css'))
>>>>>>> 92fe83a60498c0f1a17e8cc4ca66fb1c6d44e0f7
		.pipe(cssComb())
		.pipe(cleanCss())
		//.pipe(sourcemaps.write())
		.pipe(gulp.dest(PATHS.dist + 'styles/'))
		.pipe(reload({stream:true}))
);

<<<<<<< HEAD
gulp.task('build:modules', ['clean:modules'], () =>
	gulp.src(PATHS.src + 'modules/**/*.scss')
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		//.pipe(sourcemaps.init())
		.pipe(sass.sync({
	      outputStyle: 'expanded',
	      precision: 10,
	    }).on('error', console.error.bind(console)))
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
		//.pipe(concat('main.css'))
		.pipe(cssComb())
		.pipe(cleanCss())
		//.pipe(sourcemaps.write())
		.pipe(gulp.dest(PATHS.dist + 'modules/'))
		.pipe(reload({stream:true}))
);

gulp.task('scripts', () =>
  gulp.src([PATHS.src +'modules/**/*.js', PATHS.src + 'components/**/*.js'])
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    //.pipe(sourcemaps.init())
    //.pipe(sourcemaps.write('.'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest( PATHS.dist +'scripts'))
    .pipe(reload({stream: true}))
=======
gulp.task('scripts', () =>
  gulp.src( PATHS.src +'views/**/*.js')
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('.'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest( PATHS.dist +'scripts'))
    .pipe(reload({stream: true}));
>>>>>>> 92fe83a60498c0f1a17e8cc4ca66fb1c6d44e0f7
);

gulp.task('views',() =>
	gulp.src(PATHS.src + 'modules/*/*.twig')
		.pipe(twig({
			base: PATHS.src,
			onError: notify.onError("Error: <%= error.message %>")
		}))
		.pipe(rename({dirname: ''}))
		.pipe(gulp.dest(PATHS.dist))
);

gulp.task('clean', () =>
	del.sync(PATHS.dist)
);

gulp.task('clean:modules', () =>
	del.sync(PATHS.dist + 'modules/')
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

gulp.task('images', () => 
<<<<<<< HEAD
	gulp.src(PATHS.src +'/images/**/*.*')
    .pipe(imagemin())
    .pipe(gulp.dest( PATHS.dist +'/images'))
);

gulp.task('fonts', () => 
	gulp.src(PATHS.src+'fonts/ttf-fonts/*.*')
		.pipe(gulp.dest(PATHS.dist+'fonts/text'))
)

gulp.task('build', ['styles', 'views', 'scripts', 'images', 'fonts', 'build:icons']);

gulp.task('default', ['clean'], function() {
	gulp.start('build')
});

=======
	gulp.src(PATHS.src +'/images/*.*')
    .pipe(imagemin())
    .pipe(gulp.dest( PATHS.dist +'/images'));
);

gulp.task('fonts', () => 
	gulp.src(PATHS.src+'fonts/ttf-fonts')
		.pipe(gulp.dest(PATHS.dist+'fonts/text'))
)

>>>>>>> 92fe83a60498c0f1a17e8cc4ca66fb1c6d44e0f7
gulp.task('serve', ['styles', 'views', 'scripts'], () => {
  browserSync({
    notify: true,
    port: 9000,
    server: {
      baseDir: ['./', PATHS.dist]
    },
    routes: {
        '/vendor': 'vendor'
      }
  });

  gulp.watch([PATHS.src +'modules/**/*.twig', PATHS.src +'components/**/*.twig'], ['views']).on('change', function(file) {
    reload(file.path);
  });

  gulp.watch([PATHS.src +'fonts/svg-src/'],['build:icons']).on('change', reload);
  gulp.watch([PATHS.src +'icons/**/*.svg'], ['build:sprites']).on('change', reload);
  gulp.watch([PATHS.src +'images/**/*.*'], ['images']).on('change', reload);
<<<<<<< HEAD
  gulp.watch([PATHS.src +'styles/**/*.scss', PATHS.src +'main.scss', PATHS.src +'index.modules.scss', PATHS.src + 'components/**/*.scss', PATHS.src + 'modules/**/components/**/*.scss'], ['styles']);
  gulp.watch([PATHS.src +'views/**/*.js', PATHS.src + 'components/**/*.js'], ['scripts']);
=======
  gulp.watch([PATHS.src +'styles/**/*.scss', PATHS.src +'/components/**/*.scss'], ['styles']);
  gulp.watch([PATHS.src +'views/**/*.js'], ['scripts']);
>>>>>>> 92fe83a60498c0f1a17e8cc4ca66fb1c6d44e0f7
  gulp.watch([PATHS.src +'fonts/svg-src/'], ['build:icons']);
  gulp.watch([PATHS.src +'fonts/ttf-fonts'], ['fonts']).on('change', reload);

});

function mapGlyphs(glyph) {
  return { name: glyph.name, codepoint: glyph.unicode[0].charCodeAt(0) }
}