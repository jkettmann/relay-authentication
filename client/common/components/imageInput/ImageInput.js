import React from 'react';
import ReactDOM from 'react-dom';
import {HOC} from 'formsy-react';
import RaisedButton from 'material-ui/RaisedButton';

class FileInput extends React.Component {

  constructor () {
    super();
    this.state = {
      file: null,
      imageSrc: null
    };
  }

  openDialog () {
    const inputDom = ReactDOM.findDOMNode(this.refs.input);
    inputDom.click();
  }

  changeValue (event) {
    const target = event.currentTarget;
    this.props.setValue(target.files);

    const file = target.files[0];
    this.setState({ file });

    var reader = new FileReader();
    reader.onload = (e) => {
      this.setState({ imageSrc: e.target.result });
    }
    reader.readAsDataURL(file);
  }

  render () {
    return (
      <div style={this.props.style}>
        <RaisedButton
          ref="button"
          label={this.state.file ? this.state.file.name : this.props.label}
          fullWidth={this.props.fullWidth}
          onClick={() => this.openDialog()}/>

        <div style={{width: '100%', height: 'auto', marginTop: 20, display: this.state.imageSrc ? 'block' : 'none'}}>
          <img
            ref="preview"
            style={{width: '100%'}}
            src={this.state.imageSrc}/>
        </div>

        <input
          ref="input"
          style={{display: 'none'}}
          type="file"
          onChange={(event) => this.changeValue(event)} />
      </div>
    )
  }
}

export default HOC(FileInput);