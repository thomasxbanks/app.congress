// Gulp
const gulp = require('gulp');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const noop = require('gulp-noop');

// Dev
const browserSync = require('browser-sync').create();
// const autoprefixer = require('gulp-autoprefixer');
// const cssnano = require('gulp-cssnano');

// Css
const sass = require('gulp-sass');
const purify = require('gulp-purifycss');

// Templates
const fileinclude = require('gulp-handlebars-file-include');

// JS
const rollup = require('gulp-better-rollup');
const { eslint } = require('rollup-plugin-eslint');
const babel = require('rollup-plugin-babel');
const minify = require('rollup-plugin-babel-minify');
const strip = require('@rollup/plugin-strip');
const cleanup = require('rollup-plugin-cleanup');
const nodeResolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');

// HTML
const htmlmin = require('gulp-htmlmin');

// Images
const imagemin = require('gulp-imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminOptipng = require('imagemin-optipng');
const imageminSvgo = require('imagemin-svgo');

const packageJson = require('./package.json');

const isProduction = (process.env.NODE_ENV === 'production');
const banner = `/* LXLabs ${packageJson.name} v${packageJson.version} */`;

const root = './';
const source = 'src/';
const dist = 'dist/';

const path = {
  css: {
    in: `${root}${source}assets/css/*.{css,scss}`,
    out: `${root}${dist}css/`,
  },
  js: {
    in: `${root}${source}assets/js/index.js`,
    out: `${root}${dist}js/`,
  },
  vendor: {
    in: `${root}${source}assets/vendor/*.js`,
    out: `${root}${dist}vendor/`,
  },
  static: {
    in: `${root}${source}static/**/*.*`,
    out: `${root}${dist}`,
  },
  img: {
    in: `${root}${source}assets/images/**/*.{jpg,png,svg,gif}`,
    out: `${root}${dist}images/`,
  },
  hbs: {
    in: `${root}${source}index.hbs`,
    out: `${root}${dist}/`,
  },
};

const data = require('./src/data.js');

const cssMinPlugins = {
  outputStyle: isProduction ? 'compressed' : 'expanded',
  precision: 2,
};

const babelOptions = {
  exclude: /node_modules/,
  presets: [
    [
      '@babel/preset-env',
      {
        corejs: 3,
        modules: false,
        useBuiltIns: 'usage',
      },
    ],
  ],
};

const jsMinPlugins = [
  eslint({ configFile: './.eslintrc.json', fix: isProduction }),
  commonjs(),
  nodeResolve({ jsnext: true, browser: true }),
  isProduction ? babel(babelOptions) : noop(),
  isProduction ? strip({ sourceMap: false }) : noop(),
  cleanup({ comments: isProduction ? 'none' : 'all', extensions: ['js'] }),
  minify({ banner, bannerNewLine: true }),
];


const imageMinPlugins = [
  imageminMozjpeg({}),
  imageminOptipng({ optimizationLevel: 5 }),
  imageminSvgo({ plugins: [{ removeViewBox: true }, { cleanupIDs: false }] }),
];

gulp.task('css', ['html'], () => gulp.src(path.css.in)
  .pipe(isProduction ? noop() : sourcemaps.init())
  .pipe(sass(cssMinPlugins).on('error', sass.logError))
  .pipe(isProduction ? purify([`${path.hbs.out}**/*.html`, `${path.js.out}**/*.js`], { minify: true, rejected: true }) : noop())
  .pipe(isProduction ? noop() : sourcemaps.write())
  .pipe(gulp.dest(path.css.out))
  .pipe(browserSync.stream()));

gulp.task('js', () => gulp.src(path.js.in)
  .pipe(isProduction ? noop() : sourcemaps.init())
  .pipe(rollup({
    plugins: jsMinPlugins,
  }, 'cjs'))
  .pipe(isProduction ? noop() : sourcemaps.write())
  .pipe(gulp.dest(path.js.out))
  .pipe(browserSync.stream()));

gulp.task('vendor', () => gulp.src(path.vendor.in)
  .pipe(concat('index.js'))
  .pipe(gulp.dest(path.vendor.out))
  .pipe(browserSync.stream()));

gulp.task('html', ['template'], () => gulp.src(`${root + dist}**/*.html`)
  .pipe(htmlmin({ collapseWhitespace: !!isProduction }))
  .pipe(gulp.dest(root + dist))
  .pipe(browserSync.stream()));

gulp.task('images', () => gulp.src(path.img.in)
  .pipe(imagemin(imageMinPlugins))
  .pipe(gulp.dest(path.img.out))
  .pipe(browserSync.stream()));

gulp.task('static', () => gulp.src(path.static.in, { base: root + source })
  .pipe(gulp.dest(path.static.out))
  .pipe(browserSync.stream()));

gulp.task('template', () => gulp.src(path.hbs.in)
  .pipe(fileinclude(data))
  .pipe(rename((p) => { p.extname = '.html'; return path; }))
  .pipe(gulp.dest(path.hbs.out))
  .pipe(browserSync.stream()));

gulp.task('serve', ['css', 'template', 'js'], () => {
  browserSync.init({
    server: root + dist,
  });
  gulp.watch(`${root}${source}**/*.hbs`, ['template']);
  gulp.watch(path.css.in.replace('style.scss', '*.{css,scss}'), ['css']);
  gulp.watch(path.js.in.replace('index.js', '*.js'), ['js']);
});

gulp.task('default', ['css', 'js', 'vendor', 'images', 'static', 'html']);
