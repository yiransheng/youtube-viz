import React, {Component} from 'react';
import Task from './Task';
import Header from './Header';

const tasks = [
  "Within the current category, identify the 5 most popular channels.",
  "Find the most popular hour of the day when videos from a specific category (eg. Gaming) are uploaded.",
  "Answer question: do viewers “like” shorter videos more ? (a.k.a Identify relationship between video length in minutes and like / view ratio)",
  "Answer question (follow up): what is the optimal lengthened video to get the highest like/view ratio?",
  "Answer question: what category tends to have longest videos?"
];


export default class Home extends Component {

  render() {
    const ts = tasks.map((t, i) => {
      return <Task task={t} 
                   onClick={this.props.onClick}
                   index={i} key={i} presetId={i+1} />
    });
    return (
      <div>
        <br />
        <Task key="main"
              onClick={this.props.onClick}
              task="Create New Report" 
              taskPrefix="Blank" presetId={0} />
        {ts} 
      </div>
    );
  }
}
