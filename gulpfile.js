const gulp = require('gulp'),
	nodemon = require('nodemon'),
	watch = require('gulp-watch'),
	runSequence = require('run-sequence'),
	rimraf = require('rimraf'),
	rename = require('gulp-rename');
	
const clean = require('gulp-clean');
const babel = require('gulp-babel');
const stripDebug = require('gulp-strip-debug');			
const uglify = require('gulp-uglify');
const path = require('path');



// Set variables through Node Environment variable
const build_mode = process.env.NODE_ENV || 'development';

// backend task
gulp.task('clean-api',()=>{
	return gulp.src('build/api').pipe(clean());
});

gulp.task('build-api',['clean-api'],function(){
	if(build_mode === 'production'){
		return gulp.src(['./src/api/**/*.js'])
		.pipe(babel({
			'presets': [
				'@babel/env'
			],
			'plugins': [
				'@babel/plugin-transform-runtime'
			]
		}))
		.on('error', (err)=>{
			console.log('babel > ', err);
		})
		.pipe(stripDebug())
		.pipe(uglify())
		.pipe(
			gulp.dest('build/api')
		);
	}else{
		return gulp.src(['./src/api/**/*.js'])
		.pipe(babel({
			'presets': [
				'@babel/env'
			],
			'plugins': [
				'@babel/plugin-transform-runtime'
			]
		}))
		.on('error', (err)=>{
			console.log('babel > ', err);
		})
		.pipe(
			gulp.dest('build/api')
		);
	}
	
});

gulp.task('build-backend',['build-api'],function(){
	if (build_mode === 'development') {
		nodemon.restart();		
	}
	runSequence('pipe-essintials');	
});
// watch tasks

gulp.task('backend-watch', () => {
	return watch('./src/api/*/**', () => {
		gulp.run('build-backend');
	});
});

gulp.task('pipe-essintials',()=>{
	return gulp
			.src('./src/api/db.config')
			.pipe(gulp.dest('./build/api/'));
})

// final build

gulp.task('backend',['build-backend'],function(){
	if (build_mode === 'development') {
		setTimeout(()=>{
			nodemon({
				execMap: {
					js: 'node'
				},
				script: path.join(__dirname, 'build/api/index.js'),
				ignore: ['*'],
				ext: 'noop'
			}).on('restart', () => {
				console.log('Backend Restarted!');
			}).on('error', (error) => {
				console.log(error);
				nodemon.restart();
			});
		},1500);
		runSequence('backend-watch');
	}
});