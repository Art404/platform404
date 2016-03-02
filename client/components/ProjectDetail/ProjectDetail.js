import React from 'react'
import {find, isEmpty, isEqual} from 'lodash'
import Tweet from './Tweet'
import Instagram from './Instagram'
import Carousel from '../Carousel/Carousel'
import ProjectRelated from './ProjectRelated'

class ProjectDetail extends React.Component {
  static displayName = 'ProjectDetail';

  static propTypes = {
    'db': React.PropTypes.object,
    'agent': React.PropTypes.string,
    'location': React.PropTypes.object,
    'params': React.PropTypes.object,
    'layout': React.PropTypes.string
  };

  shouldComponentUpdate (props) {
    if (isEmpty(this.props.db) && !isEmpty(props.db)) return true
    else return !isEqual(props.params, this.props.params)
  }

  getHashTags ({tags}) {
    return tags.map((t, i) => (
      <span className="ProjectDetail-tag" key={i}>{`#${t}`}</span>
    ))
  }

  hasAdditional ({additional}) {
    if (!additional) return false

    let hasAdd = false

    Object.keys(additional).forEach((k) => {
      if (!isEmpty(additional[k]) && k !== 'project_link') hasAdd = true
    })

    return hasAdd
  }

  createAdditional ({additional}) {
    let add = [], embeds = []

    Object.keys(additional).forEach((k, i) => {
      if (isEmpty(additional[k])) return

      switch (k) {
        case 'collaborators':
          add.push(
            <div className="ProjectDetail-collabs" key={`collab-${i}`}>
              <div className="ProjectDetail-add-title">{'COLLABORATORS'}</div>
              {additional[k].map((a, j) => (
                <a className="ProjectDetail-collabee" key={`collabee-${a.collabee}`} href={a.url}>{a.collabee}</a>
              ))}
            </div>
          )
          break
        case 'embeds':
          embeds.push(
            <div className="ProjectDetail-embeds" key={`embed-${i}`}>
            {additional[k].map((a, j) => {
              if (a.type === 'tweet') return <Tweet id={a.id_str} key={`embed-html-${a.id_str}`} />
              else if (a.type === 'video') {
                const iframe = `<iframe width="560" height="315" frameborder="0" allowfullscreen src="${a.embed}"></iframe>`
                return <div className="ProjectDetail-video" dangerouslySetInnerHTML={{__html: iframe}} key={`embed-html-${a.embed}`}/>
              }
              else if (a.type === 'instagram') return <Instagram embed={a.embed} key={`embed-html-${a.embed}`} />
            })}
            </div>
          )
          break
        case 'press':
          add.push(
            <div className="ProjectDetail-press" key={`press-${i}`}>
              <div className="ProjectDetail-add-title">{'PRESS'}</div>
              {additional[k].map((a, j) => (
                <a className="ProjectDetail-publication" key={`publication-${a.publication}`} href={a.url}>{a.publication}</a>
              ))}
            </div>
          )
          break
      }
    })

    return embeds.concat(add)
  }

  getProject(db, id) {
    return find(db, 'url', id )
  }

  getCarousel(project) {
    const {media} = project
    const slides = media.map((m, i) => {
      switch (m.type) {
        case 'photo':
          return <img src={m.url} key={i}/>
          break
      }
    })

    return (
      <Carousel
        key={project.id}
        ratio={[3, 1.5]}
        slides={slides}
        key="Carousel"
        controls={true}
        startingSlide={1}/>
    )
  }

  hasMedias (project) {
    return !isEmpty(project.media) && project.media.length > 1
  }

  render () {
    if (!this.props.db || !this.props.params) return null

    const project = this.getProject(this.props.db, this.props.params.projectID)
    const {agent, db} = this.props
    if (!project) return null

    return (
      <div className={`ProjectDetail-outer-container --${agent}`} key={project.id}>
        <div className="ProjectDetail-inner-container" ref="inner">
          <section className="ProjectDetail-main-content">
            <article className="ProjectDetail-profile">
              {project.media ?
                <div className="ProjectDetail-profile-image">
                  <img src={project.media[0].url}/>
                </div> : null}
              <article className="ProjectDetail-wrapper">
                <div className="ProjectDetail-profile-info">
                  <h1 className="ProjectDetail-title">
                    {project.title}
                  </h1>
                  <div className="ProjectDetail-tags">
                    {this.getHashTags(project)}
                  </div>
                  {project.additional && project.additional.project_link ?
                    <a className="ProjectDetail-project-link" href={project.additional.project_link} target="_blank">
                      {'Project Link'}
                    </a> : null}
                </div>
                <div className="ProjectDetail-links">
                  <div className="ProjectDetail-source">
                    <a className="ProjectDetail-source-link" href={project.source.url}>
                      <span className="ProjectDetail-source-text">
                        {'PROJECT SOURCE'}
                      </span>
                      <span className="Card-link-container"/>
                    </a>
                  </div>
                </div>
              </article>
            </article>

            <article className="ProjectDetail-description" dangerouslySetInnerHTML={{'__html': project.text}} />

            {this.hasMedias(project) ? this.getCarousel(project) : null}

            {this.hasAdditional(project) ?
              <article className="ProjectDetail-additional" key="additional">
                <div className="ProjectDetail-additional-title">ADDITIONAL INFORMATION</div>
                <div className="ProjectDetail-additional-items">
                  {this.createAdditional(project)}
                </div>
              </article> : null}
          </section>

          <ProjectRelated project={project} db={db} />
        </div>
      </div>
    )
  }
}

export default ProjectDetail
