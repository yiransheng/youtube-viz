import React, { Component, PropTypes } from 'react';
import Link from './Link';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from 'redux-router5';

class Nav extends Component {
  constructor(props, context) {
    super(props);
    this.router = context.router;
  }

  render() {
    const { navigateTo, route } = this.props;

    return (
      <nav>
        <Link router={ this.router } navigateTo={ navigateTo } name='home' options={{ reload: true }}>Inbox</Link>
        <Link router={ this.router } navigateTo={ navigateTo } name='report'>Report</Link>
        <Link router={ this.router } navigateTo={ navigateTo } name='report'>Preset</Link>
      </nav>
    );
  }
}

Nav.contextTypes = {
  router: PropTypes.object.isRequired
};

export default connect(
  state => state.router.route,
  dispatch => bindActionCreators({ navigateTo: actions.navigateTo }, dispatch)
)(Nav);
