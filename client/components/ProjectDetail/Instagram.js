/*eslint-disable no-undef*/
import React from 'react'
import {findDOMNode} from 'react-dom'
import request from 'superagent'
import http from 'http'

class Instagram extends React.Component {
  static propTypes = {
    'embed': React.PropTypes.string
  }

  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    this.createInstagram()
  }

  componentDidUpdate (prevProps, prevState) {
    if (!prevState.html && this.state.html) {
      window.instgrm.Embeds.process()
    }
  }

  createInstagram () {
    const postUrl = this.props.embed

    request
      .get(`http://localhost:3000/api/getInsta?url=${postUrl}`)
      .end((err, res) => {
        if (err) console.error(err)
        else {
          this.setState({
            'html': res.body.html
          })
        }
      })
  }

  render () {
    if (!this.state.html) return null

    return (
      <div className="ProjectDetail-instagram"
        dangerouslySetInnerHTML={{'__html': this.state.html}}/>
    )
  }
}

export default Instagram
