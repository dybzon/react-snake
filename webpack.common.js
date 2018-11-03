var path = require('path');
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    // publicPath: '/snake/',
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
        {
            test: /\.js$/,
            include: path.resolve(__dirname, 'src'),
            exclude: /(node_modules|bower_components|build)/,
            use: [{ loader: 'babel-loader' }],
        },
        {
            test: /\.(png|svg|jpe?g|gif)$/i,
            use: [
                {
                    loader: 'url-loader',
                    options:{
                        fallback: "file-loader",
                        name: "[name][md5:hash].[ext]",
                        outputPath: 'assets/',
                        publicPath: '/assets/'
                    }
                }
            ]    
        },
        // {
        //     test: /\.(jpe?g|png|gif|svg)$/i,
        //     use: {
        //       loader: "url-loader",
        //       options: {
        //         limit: 25000,
        //       },
        //     },            
        // },        
        // {
        //     test: /\.(jpe?g|png|gif|svg)$/i,
        //     loader: 'file-loader',
        //     options: {
        //         name: 'images/[name].[ext]'
        //     }
        // }
    ]
  },
  resolve: {
    alias:{
      'assets': path.resolve(__dirname, 'assets')
    }
  },
  externals: {
    'react': {          
        commonjs: "react",          
        commonjs2: "react",          
        amd: "React",          
        root: "React"      
    },      
    'react-dom': {          
        commonjs: "react-dom",          
        commonjs2: "react-dom",          
        amd: "ReactDOM",          
        root: "ReactDOM"      
    },     
    // 'react': 'commonjs react' // Use the React dependency of our parent-testing-project instead of using our own
  }
};
