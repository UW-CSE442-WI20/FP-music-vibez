const React = require("react");

class ReturnBtnComponent extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { hasError, idyll, updateProps, ...props } = this.props;

    return (
      <div {...props}>
        <p class="arrow up"></p>
      </div>
    );
  }
}

module.exports = ReturnBtnComponent;
