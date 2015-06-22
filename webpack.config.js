module.exports = {
    resolve: {
        extensions: ['', '.ts', '.js']
    },
    devtool: 'source-map',
    module: {
        loaders: [{
            test: /\.ts$/,
            loader: 'awesome-typescript-loader?emitRequireType=false&library=es5&'
        }]
    },
    entry: {
        index: ['./components/Main.ts']
    },
    output: {
        path: './build',
        filename: './[name].js'
    }
};
