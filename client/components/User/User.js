import React from 'react'
import {isEmpty, uniq, cloneDeep, each} from 'lodash'
import Grid from '../Grid/Grid'
import Squad_Fixtures from '../../FIXTURES/platform404-squad-export.json'

class User extends React.Component {
  static displayName = 'User';

  static propTypes = {
    'db': React.PropTypes.object,
    'squad': React.PropTypes.array
  };


  constructor (props) {
    super(props)
    this.state = {
      'squadState': Squad_Fixtures
    }
  }

  createSquad (squad) {
    return squad.map((s, i) => (
      <div className="User-member" key={i}>
        <div className="User-member-role">{s.role}</div>
        <div className="User-email">
          <span className="User-email-icn" />
          {`${s.name}@art404.com`}
        </div>
      </div>
    ))
  }

  getUserSocial (userIndex) {
    const {squadState} = this.state

    const beIcon = 'https://db.tt/w8HSNeZn',
          facebookIcon = 'https://db.tt/zeZdD9D6',
          githubIcon = 'https://db.tt/W1LhwSsE',
          instaIcon = 'https://db.tt/gFHQ2bed',
          linkedIcon = 'https://db.tt/7ZZd4Gvo',
          tumblrIcon = 'https://db.tt/lYipN80L',
          twitterIcon = 'https://db.tt/6sr5ZeVl'

    let social = []

    Object.keys(squadState[userIndex].social).forEach((s, i) => {
      console.log('SOCIAL-MEDIA: ', s)
      let socialLink = squadState[userIndex].social[s],
          socialIcon

      switch (s) {
        case 'behance':
          socialIcon = beIcon
          break
        case 'facebook':
          socialIcon = facebookIcon
          break
        case 'github':
          socialIcon = githubIcon
          break
        case 'instagram':
          socialIcon = instaIcon
          break
        case 'linked-in':
          socialIcon = linkedIcon
          break
        case 'tumblr':
          socialIcon = tumblrIcon
          break
        case 'twitter':
          socialIcon = twitterIcon
          break
        default:
          socialIcon = twitterIcon
      }

      social.push (
        <a href={socialLink} key={i} className="User-social-link">
          <img src={socialIcon}/>
        </a>
      )
    })

    return social
  }

  getUserSkills (userIndex) {
    const {squadState} = this.state

    let skills = []
    console.log(squadState)

    squadState[userIndex].skills.forEach((s, i) => {
      skills.push(
        <span key={i} className="User-skills-single">
          {s.toUpperCase()}
        </span>
      )
    })

    return skills
  }

  render () {
    if (isEmpty(this.props.db)) return null
    const {db, squad} = this.props,
          { squadState } = this.state,
          { userID } = this.props.params

    let userIndex
    if (userID === 'Manny' || userID === 'manny') {
      userIndex = 0
    } else if ( userID === 'Moises' || userID ===  'mosies') {
      userIndex = 1
    } else if ( userID === 'Alyssa' || userID ===  'alyssa') {
      userIndex = 2
    } else if ( userID === 'Micah' || userID ===  'micah') {
      userIndex = 3
    }

    const userProfileStyles = {
      'backgroundImage': `url(${squadState[userIndex].image})`,
      'backgroundSize': 'cover',
      'backgroundPosition': 'center'
    }

    return (
      <div className="User">
        <div className="User-profile-img" style={userProfileStyles}/>
        <div className="User-blurb">
          <h3 className="User-section-title">{squadState[userIndex].fullname}</h3>
          <p className="User-bio">
            {squadState[userIndex].shortBio}
          </p>
        </div>
        <div className="User-skills">
          <div className="User-background"></div>
          <span className="User-section-title">{'SKILLS '}</span>
          {this.getUserSkills(userIndex)}
        </div>
        <div className="User-social">
          <div className="User-section-title">{'SOCIAL'}</div>
          {this.getUserSocial(userIndex)}
        </div>
        <div className="User-contact">
          <div className="User-email">
            <div className="User-section-title">{'CONTACT'}</div>
            <span className="User-email-icn" />
            {squadState[userIndex].email}
          </div>
        </div>
        
      </div>
    )
  }
}

export default User
