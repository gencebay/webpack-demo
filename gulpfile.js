var gulp = require("gulp");
var ts = require("gulp-typescript");
var gutil = require("gulp-util");
var runSequence = require('run-sequence');
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var tsProject = ts.createProject('tsconfig.json');
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

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

	var server = new WebpackDevServer(webpack(require('./webpack.config.js')), {
        publicPath: config.output.publicPath,
		stats: {
			colors: true
		}
	})
    
    server.app.use(bodyParser.json()); // for parsing application/json
    server.app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

    server.app.post('/api/savemodel', upload.array(), function (req, res, next) {
        console.log(req.body);
        res.json(req.body);
    });
    
    server.listen(8080, "localhost", function(err) {
		if(err) throw new gutil.PluginError("webpack-dev-server", err);
		gutil.log("[webpack-dev-server]", "http://localhost:8080");
	});
});