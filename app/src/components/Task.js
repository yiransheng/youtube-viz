import React, {Component} from 'react';
import { actions } from 'redux-router5';

export default class Task extends Component {

  render() {
    const {task, index, presetId, taskPrefix='Task', onClick} = this.props;
    const taskLabel = `${taskPrefix} ${index >= 0 ? index+1 : ''}`;
    const link = presetId > 0 ? `report/preset/${presetId}` : 'report';

    const handleClick = (e) => {
      e.preventDefault();
      const name = presetId > 0 ? 'report.preset' : 'report';
      const params = presetId > 0 ? { state: `${presetId}` } : {};
      onClick(name, params);
    }

    return (
      <div className="task">
        <span className="task-title">{taskLabel}</span>
        <span className="task-content">
          <a href={link} onClick={handleClick}>{task}</a>
        </span>
      </div>
    );
  }

}
