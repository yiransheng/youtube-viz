import React, {Component} from 'react';
import {Icon} from 'antd';

class Author extends Component {
  render() {
    const {name, github} = this.props;
    return (
      <div className="author">
        <span className="author-gh">
          <a href={`https://github.com/${github}`}>{name}</a>
        </span>
      </div>
    )
  }
}

export default class Footer extends Component {

  static defaultProps = {
    authors : [
      {
        name : 'Safyre Anderson',
        github : 'saffrydaffry'
      },
      {
        name : 'Alejandro Rojas',
        github : 'venamax'
      },
      {
        name : 'Yiran Sheng',
        github : 'yiransheng'
      }
    ]
  }

  render() {
    const {authors} = this.props;

    return (
      <footer>
        <div className="footer-label">A MIDS W209 Final Project</div>
        <div className="footer-divider"> | </div>
        <div className="github-link">
          <a href="https://github.com/yiransheng/youtube-viz"><Icon type="github" /> &nbsp; Github</a>
        </div>
        <div className="footer-divider"> | </div>
        {authors.map(a => <Author {...a} />)}
      </footer>
    );
  }
}
