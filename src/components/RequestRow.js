import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";

import web3 from "../../ethereum/web3";
import Campaign from "../../ethereum/campaign";

let accounts = [];

class RequestRow extends Component {
  state = {
    data_eth_conv_rate: 0,
    iscreator: false
  };
  static async getInitialProps(props) {
    await web3.eth.getAccounts().then(address => (accounts = address));
  }

  componentDidMount() {
    fetch("https://api.coinmarketcap.com/v2/ticker/1027/?convert=SGD", {
      method: "GET"
    })
      .then(response => response.json())
      .then(data => {
        this.setState({
          data_eth_conv_rate: data["data"]["quotes"]["SGD"]["price"]

          // conv_value : toString(parseFloat(value)/data_eth_conv_rate) ,
        });
        // console.log(this.state.data_eth_conv_rate)

      });
  }

  onApprove = async () => {
    const campaign = Campaign(this.props.address);

    const accounts = await web3.eth.getAccounts();
    await campaign.methods.approveRequest(this.props.id).send({
      from: accounts[0]
    });
  };

  onFinalize = async () => {
    const campaign = Campaign(this.props.address);

    const accounts = await web3.eth.getAccounts();
    await campaign.methods.finalizeRequest(this.props.id).send({
      from: accounts[0]
    });
  };

  render() {
    const { Row, Cell } = Table;
    const { id, request, approversCount } = this.props;
    const readyToFinalize = request.approvalCount > approversCount / 2;
    // console.log(request.value)

    return (
      <Row
        disabled={request.complete}
        positive={readyToFinalize && !request.complete}
      >
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>
          {parseFloat(
            parseFloat(web3.utils.fromWei(request.value, "ether")) *
              this.state.data_eth_conv_rate
          ).toFixed(2)}
        </Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>
          {request.approvalCount}/{approversCount}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button color="green" basic onClick={this.onApprove}>
              Approve
            </Button>
          )}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button
              disabled={!readyToFinalize}
              basic={!readyToFinalize}
              color="teal"
              onClick={this.onFinalize}
            >
              Finalize
            </Button>
          )}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
