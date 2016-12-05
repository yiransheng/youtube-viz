import React, {Component} from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;
import {every, values, isObject, isArray, isNumber} from 'lodash';
import jsep from 'jsep';

const idents = new Set([
    // "category",
    // "contentDetails_duration",
    // "contentDetails_projection",
    "duration_sec",
    "statistics_age_days",
    // "id",
    // "snippet_categoryId",
    // "snippet_channelId",
    // "snippet_channelTitle",
    // "snippet_localized_title",
    // "snippet_publishedAt",
    // "snippet_tags",
    // "snippet_thumbnails_default_url",
    // "snippet_title",
    "statistics_commentCount",
    "statistics_dislikeCount",
    "statistics_favoriteCount",
    "statistics_likeCount",
    "statistics_viewCount"
]);
const funcs = new Set([
  'log',
  'exp',
  'floor',
  'ceil',
  'pow'
]);
const types = new Set([
  'BinaryExpression',
  'Literal',
  'Identifier',
  'CallExpression'
]);

function tryParse(expr) {
  try {
    const tree = jsep(expr);
    console.log(tree);
    const valid = checkType(tree) && checkIdents(tree);  
    return valid ? tree : null;
  } catch (err) {
    console.error(err);
    return null;
  }
}
function checkType(tree) {
  if (!isObject(tree)) {
    return true;
  }
  if (tree.type && !types.has(tree.type)) {
    return false; 
  }
  if (isArray(tree)) {
    return every(tree, checkType);
  }
  const children = values(tree)
    .filter(isObject);

  return every(children, checkType);
}
function checkIdents(tree) {
  if (!isObject(tree)) {
    return true;
  }
  if (tree.type && tree.type === 'Identifier') {
    return idents.has(tree.name) || funcs.has(tree.name); 
  }
  if (tree.type && tree.type === 'Literal') {
    return isNumber(tree.value);
  }
  if (isArray(tree)) {
    return every(tree, checkIdents);
  }
  const children = values(tree)
    .filter(isObject);

  return every(children, checkIdents);
}

class Formula extends Component {
  constructor(props) {
    super(props);
    this.state = {
      parseTree : null,
      raw  : '',
      name : ''
    };
  }
  _onFormulaChange(expr) {
    const tree = tryParse(expr);
    this.setState({
      raw : expr,
      parseTree : tree
    });
  }
  _onNameChange(name) {
    this.setState({ name });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!this.state.parseTree || !this.state.name) {
      return;
    }
    if (idents.has(this.state.name)) {
      return;
    }
    this.props.onAdd({
      name : this.state.name,
      formula : this.state.parseTree,
      raw : this.state.raw
    });
    this.setState({
      parseTree : null,
      raw : '',
      name : ''
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formulaError = this.state.raw && (this.state.parseTree === null);
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: 'Name Formula' }],
          })(
            <Input onChange={e => this._onNameChange(e.target.value)} 
                   addonBefore={<Icon type="info-circle" />} placeholder="Name" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('raw', {
            rules: [{ required: true, message: 'Type Formula' }],
          })(
            <Input onChange={e => this._onFormulaChange(e.target.value)} 
                   addonBefore={<Icon type="edit" />} placeholder="log(statistics_likeCount+1)" />
          )}
        </FormItem>
        <span className="form-error">{formulaError ? 'Your formula is invalid' : ''}</span> 
        <FormItem style={{ textAlign: 'right' }}>
          { (formulaError || !this.state.name || !this.state.parseTree) ?
          (
            <Button type="primary" htmlType="submit" className="login-form-button" disabled>
             Add Formula
            </Button>
          ) : (
            <Button type="primary" htmlType="submit" className="login-form-button">
             Add Formula
            </Button>
          )}
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(Formula);
