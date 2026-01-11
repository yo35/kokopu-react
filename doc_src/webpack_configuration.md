Kokopu-React is not a "pure" JavaScript/TypeScript library, in that it is shipped with other type of files:
- `*.css` files (stylesheets),
- `*.ogg` files (sounds),
- `*.png` files (images),
- `*.woff` and `*.woff2` files (fonts).

If you are using a bundler such as [Webpack](https://webpack.js.org/) to package an application that depends on Kokopu-React,
it must be configured so that these files are handled properly. An example of Webpack loading rules suitable for Kokopu-React is provided below:

```plain
module.exports = {
    // ...
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [ 'style-loader', 'css-loader' ],
                // ... or any other configuration that loads the matching files as global CSS.
            },
            {
                test: /\.(ogg|png|woff|woff2)$/i,
                type: 'asset/resource',
                // ... or any other configuration that loads the matching files as resources.
            },
        ],
    },
};
```
