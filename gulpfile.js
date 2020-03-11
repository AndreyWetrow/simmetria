// bower подключения:
// bower install fotorama
// bower i selectize
// bower install --save slick-carousel
// bower install animate.css --save
// bower install simplebar нет min.js сам скачал и вставил
// bower install magnific-popup

// npm i jquery-validation

//npm i -g npm-check-updates - С помощью npm-check-updates можно узнать какие зависимости обновились с момента их установки с помощью npm/bower.
//Потом, перед иницииализацией - ncu (просто проверка package.json на обновления), если есть что обновлять тогда ncu -u

//Инициализация проекта: npm i
//Для запуска скрипта из package.json: npm run (Имя скрипта)
//Для сжатия картинок лучше использовать сайт https://tinypng.com/
//npm init -y - создает пустой package.json с заполненными по умолчанию параметрами

const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
var gcmq = require('gulp-group-css-media-queries');
const uglify = require('gulp-uglify'); 
var sass = require('gulp-sass');
const smartgrid = require('smart-grid');
//Конец Smartgrid
const cheerio = require('gulp-cheerio');
const imagemin = require('gulp-imagemin');
// const plumber = require('gulp-plumber'); //Для вывода ошибок
// const coffee = require('gulp-coffee');
const replace = require('gulp-replace');
const svgSprite = require('gulp-svg-sprite');
const svgmin = require('gulp-svgmin');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const imageminPngquant = require('imagemin-pngquant');
const pug = require("gulp-pug");
const merge = require("merge-stream");
// const svgo = require('gulp-svgo');
// const htmlbeautify = require('gulp-html-beautify');

// Первый вариант
// const isDev = false;
// const isProd = !isDev;
// const isSync = true;

// Второй вариант
const isDev = (process.argv.indexOf('--dev') !== -1);
const isProd = !isDev;
const isSync = (process.argv.indexOf('--sync') !== -1);

// let cssFiles = [
  // './node_modules/normalize.css/normalize.css',
//   './src/css/base.css',
//   './src/css/other.css',
//   './src/css/styles.css'
// ];

let jsFiles = [
  './src/libs/jquery/jquery.min.js',
  './src/libs/magnific-popup/dist/jquery.magnific-popup.min.js',
  'node_modules/simplebar/dist/simplebar.min.js',
  // './src/libs/slick-carousel/slick/slick.min.js',
  // './node_modules/wow.js/dist/wow.min.js',
  // './src/libs/simplebar/packages/simplebar/src/simplebar.min.js',
  // './src/libs/jqueryValidation/jquery.validate.min.js',
  // './src/libs/maskedinput/maskedinput.js',
  // './src/libs/noUiSlider/nouislider.min.js',
  // './src/libs/wNumb/wNumb.min.js',
  // './src/libs/jquery-mmenu/jquery.mmenu.min.all.js', 
  // './src/libs/menuStyleSlider/js/index.js', 
  // './src/libs/OwlCarousel/OwlCarousel2-2.3.4/dist/owl.carousel.min.js', 
  // './src/libs/jQuery.equalHeights/jquery.equalheights.js', 
  // './src/libs/fotorama/fotorama.js', 
  // './src/libs/selectize/dist/js/standalone/selectize.min.js', 
  './src/js/script.js'
];

function clear() {
  return del('build/*');
} 

function styles() {
  return gulp.src('./src/scss/style.scss')
    .pipe(gulpif(isDev, sourcemaps.init()))
    .pipe(sass())
    // .pipe(concat('styles.css'))
    // .on('error', console.error.bind(console))

    .pipe(autoprefixer({
      overrideBrowserslist: ['>0.1%'],
      cascade: false
    }))
    //Из-за gcmq() плохо работает sourseMap, наверное луче использовать в конце верстки
    // .pipe(gcmq()) 
    .pipe(gulpif(isProd, cleanCSS({ level: 2 })))
    .pipe(gulpif(isDev, sourcemaps.write()))

    .pipe(gulp.dest('./build/css'))
    .pipe(gulpif(isSync, browserSync.stream()));
}

function scripts() {
  return gulp.src(jsFiles)
    .pipe(gulpif(isDev, sourcemaps.init()))
    .pipe(concat('all.js'))
    // .pipe(uglify({
    //   toplevel: true
    // }))
    .pipe(gulpif(isDev, sourcemaps.write()))
    .pipe(gulp.dest('./build/js'))
    .pipe(gulpif(isSync, browserSync.stream()))
}

// function allimg() {
//   return gulp.src('./src/img/**/*.{png, jpg}')
//     .pipe(gulp.dest('./build/img'))
//     .pipe(gulpif(isSync, browserSync.stream()))
// }


function images() {
  return gulp.src('./src/img/**/*.{png,jpg}')
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.mozjpeg({quality: 75, progressive: true}),
      imagemin.optipng({optimizationLevel: 5})
    ]))
    .pipe(gulp.dest('./build/img'))
    .pipe(gulpif(isSync, browserSync.stream()))
}

function svg() {
  return gulp.src('./src/img/sprite/**/*.svg')
    .pipe(svgmin({
      js2svg: {
        pretty: true
      }
    }))
    .pipe(cheerio({
      run: function($) {
        $('[fill]').removeAttr('fill');
        $('[stroke]').removeAttr('stroke');
        $('[style]').removeAttr('style');
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(replace('&gt;', '>'))
    // build svg sprite
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: "sprite.svg" 
        }
      }
    })) 
    .pipe(gulp.dest('./build/img/'))
};

function totalSvg() {
  return gulp.src('./src/img/totalSvg/**/*.svg')
    .pipe(gulp.dest('./build/img'))
    .pipe(gulpif(isSync, browserSync.stream()))
}

function html() {
  return gulp.src('./src/*.html')
    .pipe(gulp.dest('./build'))
    .pipe(gulpif(isSync, browserSync.stream()))
}

function htmlPug() {
  return gulp
    .src("./src/pug/*.pug")
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest("./build"))
    .pipe(gulpif(isSync, browserSync.stream()));
} 

function clearFonts() {
  return del('./build/fonts');
}
function fonts() {
  return gulp
    .src("./src/fonts/copyFonts/**/*")
    .pipe(gulp.dest("./build/fonts"))
    .pipe(gulpif(isSync, browserSync.stream()));
}

// function clearCopyResources() {
//   return del([
//     './build/fonts',
//     './build/img/**/*.svg',
//     './build/*.php'
//   ]);
// }

// function copyResources() {
//   return merge([
//       gulp.src('./src/img/**/*.svg').pipe(gulp.dest('./build/img')),
//       gulp.src('./src/img/**/*.gif').pipe(gulp.dest('./build/img')),
//       gulp.src('./src/*.php').pipe(gulp.dest('./build/'))
//   ])
//   .pipe(gulpif(isSync, browserSync.stream()));
// };

function watch() {
  if (isSync) {
    browserSync.init({
      server: {
        baseDir: "./build"
      }
    });
  }
  gulp.watch('./src/scss/**/*.scss', styles);
  gulp.watch('./src/libs/**/*', gulp.parallel(styles, scripts));
  gulp.watch('./src/**/*.html', html);
  gulp.watch("./src/**/*.pug", htmlPug);
  gulp.watch('./src/js/**/*.js', scripts);
  gulp.watch('./src/img/**/*.{png,jpg}', images);
  gulp.watch('./src/img/sprite/*.svg', svg);
  gulp.watch('./src/img/totalSvg/**/*.svg', totalSvg);
  gulp.watch('./src/fonts/**/*', gulp.series(clearFonts, fonts));
  // gulp.watch('./src/img/**/*.{png,jpg}', allimg);
  // gulp.watch('./src/img/**/*.svg', gulp.series(clearCopyResources, copyResources, svg));
  // gulp.watch('./src/*.php', gulp.series(clearCopyResources, copyResources));
  // gulp.watch('./src/fonts/**/*', gulp.series(clearCopyResources, copyResources));
  gulp.watch('./smartgrid.js', grid);
}

function grid(done) {
  delete require.cache[require.resolve('./smartgrid.js')];
  let settings = require('./smartgrid.js');
  smartgrid('./src/scss', settings);

  // settings.offset = '3.1%';
  // settings.filename = 'smart-grid-per';
  // smartgrid('./src/css', settings);
  done();
}

let build = gulp.series(
  clear,
  gulp.parallel(htmlPug, styles, scripts, images, svg, totalSvg, fonts)
);

gulp.task('build', gulp.series(grid, build));
gulp.task('watch', gulp.series(build, watch));

gulp.task('grid', grid);