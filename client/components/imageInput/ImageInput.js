import React from 'react'
import PropTypes from 'prop-types'
import { HOC } from 'formsy-react'
import RaisedButton from 'material-ui/RaisedButton'

class FileInput extends React.Component {
  static propTypes = {
    setValue: PropTypes.func.isRequired,
    label: PropTypes.node,
    fullWidth: PropTypes.bool,
    // eslint-disable-next-line react/forbid-prop-types
    style: PropTypes.object,
  }

  static defaultProps = {
    label: null,
    fullWidth: false,
    style: null,
  }

  constructor() {
    super()
    this.state = {
      file: null,
      imageSrc: null,
    }
  }

  setInputElement = (element) => {
    this.inputElement = element || {}
  }

  openDialog = () => {
    this.inputElement.click()
  }

  changeValue = (event) => {
    const target = event.currentTarget
    this.props.setValue(target.files)

    const file = target.files[0]
    this.setState({ file })

    // eslint-disable-next-line no-undef
    const reader = new FileReader()
    reader.onload = (e) => {
      this.setState({ imageSrc: e.target.result })
    }
    reader.readAsDataURL(file)
  }

  render() {
    return (
      <div style={this.props.style}>
        <RaisedButton
          label={this.state.file ? this.state.file.name : this.props.label}
          fullWidth={this.props.fullWidth}
          onClick={this.openDialog}
        />

        <div
          style={{
            width: '100%',
            height: 'auto',
            marginTop: 20,
            display: this.state.imageSrc ? 'block' : 'none',
          }}
        >
          <img
            style={{ width: '100%' }}
            src={this.state.imageSrc}
            alt={this.state.file ? this.state.file.name : 'new image'}
          />
        </div>

        <input
          ref={this.setInputElement}
          style={{ display: 'none' }}
          type="file"
          onChange={this.changeValue}
        />
      </div>
    )
  }
}

export default HOC(FileInput)
