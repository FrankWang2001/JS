var Generator = require('yeoman-generator');

module.exports = class extends Generator {

    // The name `constructor` is important here
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);
    }

    async initPackage() {
        let answer = await this.prompt([
            {
                type: "input",
                name: "name",
                message: "Your project name",
                default: this.appname // Default to current folder name
            },
        ])

        const pkgJson = {
            "name": answer.name,
            "version": "1.0.0",
            "main": "index.js",
            "scripts": {
                "test": "echo \"Error: no test specified\" && exit 1"
            },
            "author": "",
            "license": "ISC",
            "devDependencies": {

            },
            "dependencies": {
                // "vue": "^2.9.6",
                // "webpack": "",
                // "vue-loader": ""
            }
        };

        // Extend or create package.json file in destination path
        this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
        this.npmInstall(["vue"], { 'save-dev': false });
        this.npmInstall(["webpack", "vue-style-loader", "@babel/core", "@babel/preset-env", "@babel/register", "mocha", "nyc", "css-loader", "copy-webpack-plugin", "vue-template-compiler"], { 'save-dev': true });



        this.fs.copyTpl(
            this.templatePath('sample-test.'),
            this.destinationPath('test/sample-test.js.'),
            {}
        );
        this.fs.copyTpl(
            this.templatePath('babelrc.'),
            this.destinationPath('babelrc.'),
            {}
        );
        this.fs.copyTpl(
            this.templatePath('nycrc.'),
            this.destinationPath('nycrc.'),
            {}
        );

        this.fs.copyTpl(
            this.templatePath('HelloWorld.vue'),
            this.destinationPath('src/HelloWorld.vue'),
            {}
        );
        this.fs.copyTpl(
            this.templatePath('webpack.config.js'),
            this.destinationPath('webpack.config.js'),
            {}
        );
        this.fs.copyTpl(
            this.templatePath('main.js'),
            this.destinationPath('main.js'),
            {}
        );
        this.fs.copyTpl(
            this.templatePath('index.html'),
            this.destinationPath('sre/index.html'),
            { title: answer.name }
        );
    }

};