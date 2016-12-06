import React, {Component} from 'react';
import {DatePicker} from 'antd';
import enUS from 'antd/lib/date-picker/locale/en_US';
import moment from 'moment';

const {RangePicker} = DatePicker;
const dateFormat = "YYYY-MM-DD";

moment().locale('en-gb');

export default class DateRange extends Component {
  render() {
    const {range, onChange} = this.props;
    return (
      <RangePicker
        locale={enUS}
        format={dateFormat}
        placeholder={['Start Time', 'End Time']}
        defaultValue={range ? range.map(d => moment(d).locale('en').format(dateFormat)) : undefined}
        onChange={onChange}
      />
    );
  }
}
