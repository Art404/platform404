# Iso-Boiler404

Boilerplate for Isomorphic React applications

## Features

- [x] [Babel](https://babeljs.io/)
- [x] [ESLint](http://eslint.org/)
- [x] [Express](http://expressjs.com/)
- [x] [Mocha](https://mochajs.org/)
- [x] [React](http://facebook.github.io/react/)
- [x] [React Router](https://github.com/reactjs/react-router)
- [x] [React Transform HMR](https://github.com/gaearon/react-transform-hmr)
- [x] [Redux](http://redux.js.org/)
- [x] [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension)
- [x] [Webpack](https://webpack.github.io)

## Setup

```bash
$ npm install
```

## Usage

```bash
.
├── client                    # Source code for client-side application
│   ├── actions               # Redux action creators
│   ├── components            # Presentational/dumb components
│   ├── constants             # Global constants (action types etc.)
│   ├── containers            # Stateful/smart components
│   ├── reducers              # Redux reducers
│   ├── routes                # Routes used by React Router (shared with server)
│   ├── store                 # Redux store
│   └── index.js              # Entry point for client-side application
├── server                    # Source code for Express server
│   ├── api                   # Mock API
│   ├── middleware            # Server middleware
│   ├── views                 # Server views (Jade templates)
│   ├── index.js              # Entry point for server (with babel-register etc.)
│   └── server.js             # Express server
├── test                      # Test setup and helpers
├── .babelrc                  # Babel configuration
├── .eslintrc                 # ESLint configuration
├── browserslist              # Autoprefixer browser list
└── webpack.config.babel.js   # Webpack configuration
```

Start development server:

```bash
$ npm run start:dev
```

Start production server:

```bash
$ npm start
```

## License

MIT © ART404
