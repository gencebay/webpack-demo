var gulp = require("gulp");
var ts = require("gulp-typescript");
var gutil = require("gulp-util");
var runSequence = require('run-sequence');
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var tsProject = ts.createProject('tsconfig.json');

gulp.task("ts:build", function () {
    var tsResult = gulp.src("src/*.ts")
        .pipe(tsProject());
        
    return tsResult.js.pipe(gulp.dest("src/build"));
});

gulp.task("webpack", ['ts:build'], function(callback) {
    // run webpack
    webpack(require('./webpack.config.js'), function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            colors: true
        }));
        callback();
    });
});

gulp.task("webpack-dev-server", function(callback) {
	// Start a webpack-dev-server
    var webpackConfig = require("./webpack.config.js");
    var config = Object.create(webpackConfig);

    gutil.log(config.output.publicPath);

	new WebpackDevServer(webpack(require('./webpack.config.js')), {
        publicPath: config.output.publicPath,
		stats: {
			colors: true
		}
	}).listen(8080, "localhost", function(err) {
		if(err) throw new gutil.PluginError("webpack-dev-server", err);
		gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/wwwroot/index.html");
	});
});

gulp.task('default', ['webpack'], function(callback) {
    gulp.watch('src/*.ts', ['webpack']);
});