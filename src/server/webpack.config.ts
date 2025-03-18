import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Configuration } from 'webpack';

const config: Configuration = {
  // Entry point for client code
  entry: './src/client/main.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  // Resolve these extensions to import without specifying them
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'bundle.js', 
    path: path.resolve(__dirname, '../../public'), // Output directory for production assets
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/client/index.html', // Use index.html as a template
    }),
  ],
  mode: 'development',
};

export default config;
