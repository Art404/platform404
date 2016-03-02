import React from 'react'
import {cloneDeep, without, isEmpty, sample, isEqual} from 'lodash'
import Card from '../Card/Card'

class ProjectRelated extends React.Component {
  static displayName = 'ProjectRelated';

  static propTypes = {
    'project': React.PropTypes.object,
    'db': React.PropTypes.object
  };

  constructor (props) {
    super(props)
    this.state = {
      'mounted': false
    }
  }

  shouldComponentUpdate (props, state) {
    if (state.mounted && !this.state.mounted) return true
    else return !isEqual(props.project.id, this.props.project.id)
  }

  /*
   * This is an anti pattern but we're doing randomized rendering
   * in this component and only want that to happen on the client
   * since it will cause a checksum invariant otherwise
   */
  componentDidMount () {
    this.setState({'mounted': true})
  }

  getRelated (project, db) {
    const hashtags = project.tags
    let relatedProjects = [], allProjects = []

    Object.keys(db).forEach( d => {
      d = cloneDeep(db[d])
      allProjects.push(d)
      if (!d.tags || d.id === project.id) return
      d.matches = 0

      d.tags.forEach( t => {
        if (hashtags.indexOf(t) > -1) d.matches++
      })

      if (d.matches) {
        if (relatedProjects.length) {
          let inserted = false

          relatedProjects.forEach((r, i) => {
            if (d.matches >= r.matches && !inserted) {
              relatedProjects.splice(i, 0, d)
              inserted = true
            } else if (i === relatedProjects.length - 1 && !inserted) {
              relatedProjects.push(d)
              inserted = true
            }
          })

        } else relatedProjects.push(d)
      }
    })

    let allRelated = []
    const similiar = relatedProjects.slice(0, 2)
    let rest = without(allProjects, similiar[0], similiar[1], project)
    let randos = []

    for (var i = 0; i < 2; i++) {
      const headerText = i === 0 ? 'Similiar' : 'More'
      const randomProject = sample(rest)
      randos.push(randomProject)
      rest = without(rest, randomProject)
      const targetProjects = i === 0 ? similiar : randos

      allRelated = allRelated.concat([
        <h2 className="ProjectDetail-related-header" key={`header-${i}`}>
          <p className="ProjectDetail-similiar">{headerText}</p>
        </h2>,
        <div className="ProjectDetail-related-inner" key={`inner-${i}`}>
          {targetProjects.map((project, j) => (
            <Card
              project={project}
              layout={{
                'landscape': true,
                'framed': true,
                'showInfo': true
              }}
              key={j} />
          ))}
        </div>
      ])
    }

    return allRelated
  }

  render () {
    // return an empty div to prevent weird page-reflow jank
    if (!this.state.mounted) return (
      <section className="ProjectDetail-related" />
    )

    const {project, db} = this.props
    const relatedProjects = this.getRelated(project, db)

    return (
      <section className="ProjectDetail-related">
        {relatedProjects}
      </section>
    )
  }
}

export default ProjectRelated

