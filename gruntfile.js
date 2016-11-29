// 配置grunt代码

// 格式是固定的
module.exports = function (grunt){

	grunt.initConfig({

		// 监控一些脚本文件的改动进行服务重启服务
		watch:{
			jade:{
				files:['views/**'],
				options:{
					livereload:true
				}
			},
			js:{
				files:['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
				// tasks:['jshint'],
				options:{
					liverload:true
				}
			}
		},

		// 开发环境下的主文件和文件夹等配置的文件的监听
		nodemon:{
			dev:{//开发环境
				options:{
					file:'app.js',
					args:[],
					ignoredFiles:['README.md', 'node_modules/**', '.DS_Store'],
					watchedExtensions:['js'],
					watchFolders:['app', 'config'],
					debug:true,
					delayTime:1,
					env:{
						PORT:3000
					},
					cwd:__dirname
				}
			}
		},

		// 通过这个任务执行上面两个任务，这个任务在下面的注册默认任务那里
		concurrent:{
			tasks:['nodemon', 'watch'],
			options:{
				logConcurrentOutput:true
			}
		},

		// 单元测试的配置
		mochaTest:{
			options:{
				reporter:'spec'
			},
			src:['test/**/*.js']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');// 重新执行任务
	grunt.loadNpmTasks('grunt-nodemon');//用于实时监听，可以实时监听app.js，发生修改时自动重启app.js
	grunt.loadNpmTasks('grunt-concurrent');//针对慢任务开发的插件，优化构建时间，同时跑多个阻塞的任务
	grunt.loadNpmTasks('grunt-mocha-test');//对应用程序进行单元测试的插件

	grunt.option('force', true);//不要因为语法的错误和警告而中断了grunt的整个服务
	grunt.registerTask('default', ['concurrent']);//注册一个默认的任务
	grunt.registerTask('test', ['mochaTest']);//注册一个测试任务

};