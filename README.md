<p align="center">
  <img src="https://raw.githubusercontent.com/Art404/platform404/master/platform404.png" />
</p>


# platform404

Front-end renderer app for [Art404](http://www.art404.com)'s CMS platform. 
The aim is to provide a navigable, contextualized display of our work while allowing third party social networks to host the majority of our content. 
Projects can then be posted naturally on popular networks such as tumblr, instagram or github and then be packaged up with additional metadata for display in a portfolio context. 


# Usage

### Environment Variables

Variable | Description
:------- | :----------
firebase\_url | The Firebase server to listen to.


```bash
$ npm install
```

Start development server:

```bash
$ npm run firebase_url=XXX start:dev
```

Start production server:

```bash
$ npm start
```

DEPLOY:

* add new git commit
* `git push heroku master`


# API

Without authorizing, the database is read only, with the following endpoints available:

Endpoint | Description
:------- | :----------
db | repository of all projects where each key is a project ID.
main | holds the sites page configuration. eventually we will have alternate page configurations for different members / purposes so `main` will be distinguished.
squad | array of members with the following self-explainable properties: `name`, `role`, `url`.

You can access the api from any node app with firebase like so:

```js
var Firebase = require('firebase');
var fireAssAPI = new Firebase(process.env.firebase_url);

function doSomeCrazyShitWithProjectData (data) {
  console.log('holy shit ->', data.val());
}

fireAssAPI.child('db').once('value', doSomeCrazyShitWithProjectData);
 
```

see [firebase docs](https://www.firebase.com/docs/) for more on using firebase.


# Configuration

All configuration is stored and read from firebase. Refer to `firebase_url` in Heroku for appropriate firebase app. 

### Menu Config

The `pages` object determines the category heirarchy of the site's navigation.

eg given a config that looks like:

```js
{
  "apps": {
    "label": "Apps",
    "url": "apps",
    "icon": "apps_icon.png",
    "layout": {
      // ...
    },
    "submenu": [
      {
        "label": "Javascript",
        "url": "javascript"
      },
      {
        "label": "Python",
        "url": "python"
      },
      {
        "label": "CSS",
        "url": "css"
      }
    ]
  },
  // required, becomes highest level nav link, links to home
  "home": {
    "label": "WORK",
    "layout": {
      // ...
    }
  }
}
```

The `home` object will become the first link in the menu and will serve as an anchor to the homepage. Any other objects, in this case `Apps`, will become the rest of the links in the menu.


#### Menu Config Properties

Property | Type | Description
:------- | :--- | :----------
label | `String` | This is the label that will be rendered in the browser for all navigation purposes.
url | `String` | This is the slug that will be used in the url, will also be used for any non-browser purposes.
icon | `String` | Direct link to image file that hosts icon for this menu item.
submenu | `Array` | Collection of hashtags that will become the "submenu" when user is on that tag's page.


#### Submenu Config Properties

The submenu links will go to a page that shows a grid view of projects that contain both the submenu tag + its parent tag.

Property | Type | Description
:------- | :--- | :----------
label | `String` | This is the label that will be rendered in the browser.
url | `String` | Where the submenu link will go to.
bold | `Bool` | Makes the link bold.


### Page Config

For every object in `pages`, the `layout` property will determine the components rendered on the page + where they get content from.

eg:

```js
{
  "home": {
    "label": "WORK",
    "layout": {
      "banner": {
        "projects": [
          "138398520861",
          "139572811486",
          "101728537521"
        ],
        "tags": [
          "viral"
        ],
        "type": "scroller"
      },
      "rows": [
        {
          "content": {
            "projects": [
              "121467069611",
              "120898900716",
              "120898177576"
            ],
            "subtitle_tags": [
              "open source",
              "JavaScript",
              "web"
            ],
            "tags": [
              "code"
            ],
            "title": "Code",
            "url": "code"
          }
        },
        {
          "content": {
            "subtitle_tags": [
              "branding",
              "identity",
              "logo"
            ],
            "tags": [
              "design"
            ],
            "title": "Design",
            "url": "design"
          }
        }
      ]
    }
  }
}
```

Will produce a page with a scroller banner, and two `Row` components; `Code` & `Design`.


#### Page `layout` Properties

Property | Type | Description
:------- | :--- | :----------
banner | `object` | Contains project IDs and or tags to pull in (both optional but need at least 1).
banner.type | `String` | Currently the only banner type supported is `scroller`.
projects | `array` | Always refers to an array of project IDs that take precedence over any tagged projects.
tags | `Array` | Collection of tags that will be pulled into the component after any projects.
rows | `Array` | These will render `Row` components in order with the projects & tags.


#### Row `content` Properties

Property | Type | Description
:------- | :--- | :----------
projects | `array` | Always refers to an array of project IDs that take precedence over any tagged projects.
tags | `Array` | Collection of tags that will be pulled into the component after any projects.
title | `String` | The title of the `Row`.
url | `String` | Where the "see more" button of a `Row` will link to.
subtitle_tags | `Array` | Will be rendered underneath the `title` as a collection of clickable tag links.


### Project Data Model

While projects come from various sources, all of their data models are adopted to fit platform404's expected model. This happens via [the-standardizer](http://github.com/artnotfound/the-standardizer).

```js
{
  "title" : "Netflix and Chill Room",
  "id" : "138398520861",
  "created_at" : "2016-01-31T08:58:35-05:00",
  "priority" : 0,
  "tags" : [
    "performance",
    "social",
    "installation",
    "brand"
  ],
  "text" : "The Netflix &amp; Chill Airbnb Room is a project presented by ART404 + Tom Galle. With this project we bring the famous ‘Netflix &amp; Chill meme&rsquo; to life and offer it as an IRL experience that people can rent for a night on AirBnB. ",
  "type" : "media",
  "url" : "netflix-and-chill-room",
  "additional" : {
    "collaborators" : [
      {
        "collabee" : "Tom Galle",
        "url" : "http://tomgalle.com"
      }
    ],
    "embeds" : [
      {
        "embed" : "<blockquote class=\"twitter-tweet\" lang=\"en\"><p lang=\"en\" dir=\"ltr\">Impressive Netflix &amp; Chill listing, <a href=\"https://twitter.com/artnotfound\">@artnotfound</a> <a href=\"https://twitter.com/tomgalle\">@tomgalle</a>. We&#39;ve got some (G-rated) ideas on how to up the game. <a href=\"https://t.co/QiOoQlYP0S\">https://t.co/QiOoQlYP0S</a></p>&mdash; Airbnb (@Airbnb) <a href=\"https://twitter.com/Airbnb/status/693237148292509696\">January 30, 2016</a></blockquote><script async src=\"//platform.twitter.com/widgets.js\" charset=\"utf-8\"></script>",
        "id_str" : "693237148292509696",
        "type" : "tweet"
      }
    ],
    "press" : [
      {
        "publication" : "Tech Insider",
        "url" : "http://www.techinsider.io/netflix-and-chill-airbnb-in-new-york-city-2016-1"
      }
    ],
    "project_link" : "https://www.airbnb.com/rooms/10831922"
  },
  "media" : [
    {
      "alt_sizes" : {
        "large" : {
          "height" : 854,
          "url" : "http://41.media.tumblr.com/ad1473210777ef310a56cb995297bbe7/tumblr_o1t7lnKjNh1r1ubs7o1_1280.png",
          "width" : 1280
        },
        "medium" : {
          "height" : 167,
          "url" : "http://40.media.tumblr.com/ad1473210777ef310a56cb995297bbe7/tumblr_o1t7lnKjNh1r1ubs7o1_250.png",
          "width" : 250
        },
        "small" : {
          "height" : 75,
          "url" : "http://41.media.tumblr.com/ad1473210777ef310a56cb995297bbe7/tumblr_o1t7lnKjNh1r1ubs7o1_75sq.png",
          "width" : 75
        }
      },
      "height" : 334,
      "type" : "photo",
      "url" : "http://41.media.tumblr.com/ad1473210777ef310a56cb995297bbe7/tumblr_o1t7lnKjNh1r1ubs7o1_500.png",
      "width" : 500
    }
  ],
  "source" : {
    "author" : "art404",
    "author_url" : "http://art404.tumblr.com",
    "platform" : "tumblr",
    "url" : "http://www.art404.com/post/138398520861/netflix-and-chill-room"
  },
  "stats" : {
    "likes" : 1231,
    "reshares": 7200,
    "views": 9000
  }
}
```


#### Project Data Model Properties

Property | Type | Default | Description
:------- | :--- | :------ | :----------
title | `String` | `null` | Label to be used as project title
id | `Number` | none | Unique id, if source has id we use that one otherwise create one
url | `String` | none | Url slug that will be used for project detail page, manually set or generated from source
thumbnail | `String` | `null` | Optional, if provided will be used as the preferred picture for `Card` previews.
priority | `Number` | `0` | 0-1000, will affect a projects position when creating collection previews
text | `String` | `null` | Related project copy
created_at | `String` | none | Date project was posted, also used in conjunction with priority to determine project position
type | `String` | none | Project types dictatate what components will render them, manually set or generated from source
source | `Object` | none | Contains relevant info from a project's source (where its hosted)
stats | `Object` | `null` | Statistical info about project
tags | `Array` | none | Tags are used to sort projects and create relationships
media | `Array` | `null` | External media links, with types and alt sizes if available
additional | `Object` | `null` | Any meta data not existant on the source manually added by contributor


# Tech Stack

- [x] [firebase](https://firebase.com/)
- [x] [heroku](https://heroku.com/)
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


# Structure

```bash
.
├── client                    # Source code for client-side application
│   ├── actions               # Redux action creators
│   ├── components            # Presentational/dumb components
│   ├── constants             # Global constants (action types etc.)
│   ├── containers            # Stateful/smart components
│   ├── reducers              # Redux reducers
│   ├── routes                # Routes used by React Router (shared with server)
│   ├── store                 # Redux store
│   └── index.js              # Entry point for client-side application
├── server                    # Source code for Express server
│   ├── api                   # Mock API
│   ├── middleware            # Server middleware
│   ├── views                 # Server views (Jade templates)
│   ├── index.js              # Entry point for server (with babel-register etc.)
│   └── server.js             # Express server
├── test                      # Test setup and helpers
├── .babelrc                  # Babel configuration
├── .eslintrc                 # ESLint configuration
└── webpack.config.babel.js   # Webpack configuration
```


# TODO

* Clean up CSS
* Refactor / comment some of the more complex bits like the layout creator, menu and project pages
* Write Tests


# Future

~~* Cookie based "seen" projects with total counter~~
* Dynamically change database source with special route
* More banner + row + card types
