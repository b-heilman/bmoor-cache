var $ = require('gulp-load-plugins')(),
	gulp = require('gulp'),
	map = require('map-stream'),
	webpack = require('webpack-stream'),
	Karma = require('karma').Server
	jshint = require('gulp-jshint'),
	stylish = require('jshint-stylish');

var env = require('./config/env.js');

gulp.task('demo', function() {
	return gulp.src(env.jsSrc)
		.pipe(webpack({
			entry: {
				app: './'+env.demoConfig
			},
			module: {
				roles: require('./config/webpack/rules.js')
			},
			output: {
				filename: 'demo.js'
			},
			devtool: 'source-map'
		}))
		.pipe(gulp.dest(env.demoDir));
});

gulp.task('library', function() {
	return gulp.src(env.jsDemo)
		.pipe(webpack({
			entry: {
				app: './'+env.libraryConfig
			},
			module: {
				roles: require('./config/webpack/rules.js')
			},
			output: {
				filename: env.name+'.js',
				library: env.library,
				libraryTarget: "var"
			},
			externals: env.externals
		}))
		.pipe(gulp.dest(env.distDir));
});

gulp.task('test', [], function( done ) {
	var f = __dirname + '/config/karma/main.js';
	
	return new Karma({
		configFile: f
	}, done).start();
});

var failOnError = function() {
    return map(function(file, cb) {
        if (!file.jshint.success) {
            process.exit(1);
        }
        cb(null, file);
    });
};

gulp.task('build-lint', function() {
    gulp.src( env.jsSrc )
        .pipe( jshint() )
        .pipe( jshint.reporter(stylish) )
        .pipe( failOnError() );
});

gulp.task('lint', function() {
    gulp.src( env.jsSrc )
        .pipe( jshint() )
        .pipe( jshint.reporter(stylish) );
});

gulp.task('build', ['build-lint', 'demo','library'] );

gulp.task('watch', ['build'], function(){
	return gulp.watch(
		env.jsSrc.concat(['./'+env.demoConfig]), 
		['lint', 'demo','library']
	);
});

gulp.task('serve', ['watch'], function() {
	return gulp.src(env.demoDir).pipe(
		$.webserver({
			port: 9000,
			host: 'localhost',
			fallback: 'index.html',
			livereload: true,
			open: true
		})
	)
});