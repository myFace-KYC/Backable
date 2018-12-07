import React, { Component, Fragment } from 'react';
import { Form, Button, Message, Input } from 'semantic-ui-react';

import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import { Link, Router } from '../../../src/routes';

class RequestNew extends Component {
  state = {
    value: '',
    description: '',
    recipient: '',
    loading: false,
    errorMessage: '',
    data_eth_conv_rate: 0
  };

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
      });
  }

  calculateEther(val) {
    var val_in_ether;
    if (val == "") {
      val_in_ether = 0;
    } 
    else {
      val_in_ether =
        parseFloat(val) / this.state.data_eth_conv_rate;
    }
    return val_in_ether;
  }


  static async getInitialProps(props) {
    const { address } = props.query;

    return { address };
  }

  onSubmit = async event => {
    event.preventDefault();

    const campaign = Campaign(this.props.address);
    const { description, value, recipient } = this.state;

    this.setState({ loading: true, errorMessage: '' });

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, 'ether'), recipient)
        .send({ from: accounts[0] });

      Router.pushRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Fragment>
        <Link route={`/campaigns/${this.props.address}/requests`}>
          <a>Back</a>
        </Link>
        <h3>Create a Request</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Description</label>
            <Input
              value={this.state.description}
              onChange={event =>
                this.setState({ description: event.target.value })
              }
            />
          </Form.Field>

          <Form.Field>
            <label>Value</label>
            <Input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
              label="SGD"
              labelPosition="right"
            />
          </Form.Field>
          <p>Converts to {this.calculateEther(this.state.value).toFixed(6)} ETH</p>

          <Form.Field>
            <label>Recipient</label>
            <Input
              value={this.state.recipient}
              onChange={event =>
                this.setState({ recipient: event.target.value })
              }
            />
          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button primary loading={this.state.loading}>
            Create!
          </Button>
        </Form>
      </Fragment>
    );
  }
}

export default RequestNew;
