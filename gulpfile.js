var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

// Tâche par défaut
gulp.task('default', ['serve']);

// Tâche de build
gulp.task('dist', ['copy', 'img', 'lint'], function(){
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');

    return gulp.src('app/*.html')
        .pipe($.useref.assets())
        .pipe(jsFilter)
        .pipe($.uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.minifyCss())
        .pipe(cssFilter.restore())
        .pipe($.useref.restore())
        .pipe($.useref())
        .pipe(gulp.dest('dist'));
});

// Tâche de livraison
gulp.task('delivery', ['dist'], function(){
    gulp.src('dist/**/*')
        .pipe($.zip('tuto-gulp-introduction.zip'))
        .pipe(gulp.dest('.'));
});


// Création des watchers
gulp.task('serve', ['server', 'scss'], function () {
    // Watch .scss files
    gulp.watch('app/scss/**/*.scss', ['scss']);
});

// Lance le serveur
gulp.task('server', function () {
    gulp.src('app')
        .pipe($.webserver({
            livereload: true,
            port: 8000
        }));

    var options = {
        url: "http://localhost:8000",
        app: "chrome"
    };
    gulp.src("app/index.html")
        .pipe($.open("", options));
});

// Lance le serveur de prod
gulp.task('server:prod', function() {
    gulp.src('dist')
        .pipe($.webserver({
            livereload: true,
            port: 9000
        }));

    var options = {
        url: "http://localhost:9000",
        app: "chrome"
    };
    gulp.src("dist/index.html")
        .pipe($.open("", options));
});

// Compile les SCSS : !!! https://github.com/ai/autoprefixer !!!
gulp.task('scss', function () {
    return gulp.src('app/scss/app.scss')
        .pipe($.plumber())
        .pipe($.sass())
        .pipe($.autoprefixer("last 1 version"))
        .pipe(gulp.dest('app/css'));
});

// Optimisation des images
gulp.task('img', function(){
    return gulp.src('app/img/**/*')
        .pipe($.imagemin())
        .pipe(gulp.dest('dist/img'));
});

// Détection des erreurs de codage JavaScript
gulp.task('lint', function() {
    return gulp.src('app/js/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jshint.reporter('fail'));
});

// Clean du dossier dist
gulp.task('clean', function(){
    return gulp.src('dist', {read: false})
        .pipe($.clean());
});

// Copie des fichiers dans le répertoire dist
gulp.task('copy', ['clean'], function(){
    return gulp.src([
        'app/index.html'
    ], { base: './app' }).pipe(gulp.dest('dist'));
});