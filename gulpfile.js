var gulp = require('gulp');
var path = require('path');
var webpack = require('gulp-webpack');
var rename = require('gulp-rename'); //更改名字
var uglify = require('gulp-uglify'); //js代码压缩
var sass = require('gulp-sass');
var notify = require('gulp-notify'); //通知信息
var autoprefixer = require('gulp-autoprefixer');
var html2jade = require('gulp-html2jade');
var rev = require('gulp-rev');
var HtmlWebpackPlugin = require('html-webpack-plugin');

let modules = {
	loaders: [{
		//这是处理es6文件
		test: /\.js$/,
		loader: 'babel-loader',
		exclude: /node_modules/,
		query: {
			presets: ['es2015'],
			plugins: ['transform-runtime']
		}
	}, {
		//这是处理scss文件
		test: /\.scss$/,
		loader: 'style!css!sass'
	}, {
		test: /\.vue$/,
		loader: "vue"
	}, {
		// 这是处理css文件
		test: /\.css$/,
		loaders: ["style", "css"]
	}, {
		test: /\.(png|jpg|gif)$/,
		loader: 'url',
		query: {
			// inline files smaller then 10kb as base64 dataURL
			limit: 10000,
			// fallback to file-loader with this naming scheme
			name: '[name].[ext]?[hash]'
		}
	}]
}

gulp.task('sass', function() {
	return gulp.src('./html/sass/*.scss')
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions', 'last 3 Safari versions'],
			cascade: true,
			remove: true
		}))
		.pipe(gulp.dest('./html/css'));
});

gulp.task('sass:watch', function() {
	gulp.watch('./html/sass/*.scss', ['sass']);
});

// gulp.task('html',function(){
// 	return gulp.src('./*.html')
// 		.pipe(html2jade({nspaces:2}))
// 		.pipe(gulp.dest('views/'));
// });


gulp.task('postdetail', ['sass'], function() {
	return gulp.src('./html/src/postdetail.js')
		.pipe(webpack({
			watch: true,
			output: {
				filename: 'bundle-postdetail.js'
			},
			module: modules,
			resolve: {
				extensions: ['', '.js', '.jsx'],
				alias: {
					'vue$': 'vue/dist/vue.js'
				}
			},
		}))
		// .pipe(uglify())//生产的时候再启用压缩
		.pipe(gulp.dest('html/dist/'))
		.pipe(notify("<%= file.relative %> 成功生成!"));
});

gulp.task('ticket', ['sass'], function() {
	return gulp.src('./html/src/ticket.js')
		.pipe(webpack({
			watch: true,
			output: {
				filename: 'bundle-ticket.js'
			},
			module: modules,
			resolve: {
				extensions: ['', '.js', '.jsx'],
				alias: {
					'vue$': 'vue/dist/vue.js'
				}
			},
			plugins: [new HtmlWebpackPlugin({
				title: "身边订票",
				filename: "ticket.html",
				hash: true,
				template: "!!ejs!html/default.ejs",
				inject: true
			})]
		}))
		// .pipe(uglify())//生产的时候再启用压缩
		// .pipe(rev())
		.pipe(gulp.dest('html/dist/'))
		// .pipe(rev.manifest())
		// .pipe(gulp.dest('html/dist/'))
		.pipe(notify("<%= file.relative %> 成功生成!"));
});

gulp.task('app', function() {
	return gulp.src('./html/js/commenting.js')
		.pipe(webpack({
			watch: true,
			output: {
				filename: 'bundle-commenting.js'
			},
			module: modules,
			resolve: {
				extensions: ['', '.js', '.jsx'],
				alias: {
					'vue$': 'vue/dist/vue.js'
				}
			},
		}))
		// .pipe(uglify())//生产的时候再启用压缩
		.pipe(gulp.dest('html/dist/'))
		.pipe(notify("<%= file.relative %> 成功生成!"));
});

gulp.task('ticketorder', function() {
	return gulp.src('./html/src/ticketorder.js')
		.pipe(webpack({
			watch: true,
			output: {
				filename: 'bundle-ticketorder.js'
			},
			module: modules,
			resolve: {
				extensions: ['', '.js', '.jsx'],
				alias: {
					'vue$': 'vue/dist/vue.js'
				}
			},
		}))
		// .pipe(uglify())//生产的时候再启用压缩
		.pipe(gulp.dest('html/dist/'))
		.pipe(notify("<%= file.relative %> 成功生成!"));
});

gulp.task('ticketuser', function() {
	return gulp.src('./html/src/ticketuser.js')
		.pipe(webpack({
			watch: true,
			output: {
				filename: 'bundle-ticketuser.js'
			},
			module: modules,
			resolve: {
				extensions: ['', '.js', '.jsx'],
				alias: {
					'vue$': 'vue/dist/vue.js'
				}
			},
		}))
		// .pipe(uglify())//生产的时候再启用压缩
		.pipe(gulp.dest('html/dist/'))
		.pipe(notify("<%= file.relative %> 成功生成!"));
});

gulp.task('wxlist', function() {
	return gulp.src('./html/src/wxlist.js')
		.pipe(webpack({
			watch: true,
			output: {
				filename: 'bundle-wxlist.js'
			},
			module: modules,
			resolve: {
				extensions: ['', '.js', '.jsx'],
				alias: {
					'vue$': 'vue/dist/vue.js'
				}
			}
		}))
		// .pipe(uglify())//生产的时候再启用压缩
		.pipe(gulp.dest('html/dist/'))
		.pipe(notify("<%= file.relative %> 成功生成!"));
});

gulp.task('checkin', function() {
	return gulp.src('./html/src/checkin.js')
		.pipe(webpack({
			watch: true,
			output: {
				filename: 'bundle-checkin.js'
			},
			module: modules,
			resolve: {
				extensions: ['', '.js', '.jsx'],
				alias: {
					'vue$': 'vue/dist/vue.js'
				}
			},
			plugins: [new HtmlWebpackPlugin({
				title: "有奖签到",
				filename: "checkin.html",
				hash: true,
				template: "!!ejs!html/default.ejs",
				inject: true
			})]
		}))
		// .pipe(uglify())//生产的时候再启用压缩
		// .pipe(rev())
		.pipe(gulp.dest('html/dist/'))
		// .pipe(rev.manifest())
		// .pipe(gulp.dest('html/dist/'))
		.pipe(notify("<%= file.relative %> 成功生成!"));
});
