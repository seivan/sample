module.exports = {
    resolve: {
        extensions: ['', '.ts', '.js'],
        modulesDirectories: ['node_modules']
    },
    devtool: 'source-map',
    module: {
        loaders: [{
            test: /\.ts$/,
            loader: 'awesome-typescript-loader?emitRequireType=false&library=es5'
        }]
    },
    entry: {
        index: ['./components/Main.ts']
    },

    output: {
        path: '../build',
        filename: './Main.js'
    }
};
