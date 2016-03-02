/*eslint-disable no-undef*/
import React from 'react'
import {findDOMNode} from 'react-dom'

class Tweet extends React.Component {
  static propTypes = {
    'id': React.PropTypes.string
  };

  componentDidMount () {
    this.waitForTwitter()
  }

  waitForTwitter () {
    let timer

    const checker = () => {
      if (window.twttr && window.twttr.widgets) {
        clearInterval(timer)
        this.createTweet()
      }
    }

    timer = setInterval(checker, 500)
  }

  createTweet () {
    window.twttr.widgets.createTweet(
      this.props.id,
      findDOMNode(this.refs.tweet), {
        align: 'left'
    })
  }

  render () {
    return <div ref="tweet" />
  }
}

export default Tweet
