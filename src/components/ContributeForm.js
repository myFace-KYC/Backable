import React, { Component } from "react";
import { Form, Input, Message, Button } from "semantic-ui-react";

import Campaign from "../../ethereum/campaign";
import web3 from "../../ethereum/web3";
import { Router } from "../routes";

class ContributeForm extends Component {
  state = {
    value: "",
    conv_value: "",
    errorMessage: "",
    loading: false,
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

  onSubmit = async event => {
    event.preventDefault();

    const campaign = Campaign(this.props.address);

    this.setState({ loading: true, errorMessage: "" });

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(
          (
            parseFloat(this.state.value) / this.state.data_eth_conv_rate
          ).toString(),
          "ether"
        )
      });


      const formData = new FormData();
      formData.append("backer_address", accounts[0]);
      formData.append("campaign_address", this.props.address);
      // PUT call to Database
      const url =
        "https://backable-db.herokuapp.com/api/v1/submit-new-pledge/";
      fetch(url, {
        method: "PUT",
        body: formData

      });

      Router.replaceRoute(`/campaigns/${this.props.address}`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false, value: "" });
  };

  calculateEther() {
    var val_in_ether;
    if (this.state.value == "") {
      val_in_ether = 0;
    } else {
      val_in_ether =
        parseFloat(this.state.value) / this.state.data_eth_conv_rate;
    }
    return val_in_ether;
  }

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Amount to Contribute</label>
          <Input
            value={this.state.value}
            onChange={event => this.setState({ value: event.target.value })}
            label="SGD"
            fluid
            labelPosition="right"
          />
        </Form.Field>
        <p>Converts to {this.calculateEther().toFixed(6)} ETH</p>

        <Message error header="Oops!" content={this.state.errorMessage} />
        <Button
          color="violet"
          animated="vertical"
          fluid
          loading={this.state.loading}
        >
          <Button.Content visible>Back this project</Button.Content>
          <Button.Content hidden>Confirm</Button.Content>
        </Button>
      </Form>
    );
  }
}

export default ContributeForm;
