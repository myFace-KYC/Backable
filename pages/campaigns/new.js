import React, { Component, Fragment } from "react";
import { Form, Button, Input, Message, Grid } from "semantic-ui-react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Router } from "../../src/routes";
import CampaignFactory from "../../ethereum/build/CampaignFactory.json";

function validate(a, b, c, d, e, f, g, h, i) {
  return {
    a: a.length === 0,
    b: b.length === 0,
    c: c.length === 0,
    d: d.length === 0,
    e: e === null,
    f: f.length === 0,
    g: g.length === 0,
    h: h.length === 0,
    i: i.length === 0
  };
}

class CampaignNew extends Component {
  state = {
    minimumContribution: "",
    campaignName: "",
    campaignAddress: "",
    campaignSubHeader: "",
    creatorName: "",
    endDate: "",
    campaignerAddress: "",
    campaignDetails: "",
    campaignTarget: "",
    tags: "",
    selectedfile: null,
    image: null,
    errorMessage: "",
    loading: false,
    data_eth_conv_rate: 0,
    value: "",
    conv_value: "",
    formError: false,
    endDateError: false,
    targetError: false,
    minError: false,
    start: 0,
    time: 0
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
    factory.events
      .returnCampaignAddress({}, function(error, event) {})
      .on("data", event => {
        this.setState({ campaignAddress: event["returnValues"]["_address"] });
        console.log("print,", this.state.campaignAddress);
        //console.log("calling...",event['returnValues']['_address']);
      });
  }

  calculateEther(val) {
    var val_in_ether;
    if (val == "") {
      val_in_ether = 0;
    } else {
      val_in_ether = parseFloat(val) / this.state.data_eth_conv_rate;
    }
    return val_in_ether;
  }

  date_diff_indays(date2) {
    var dt1 = new Date();
    var dt2 = new Date(date2);
    return Math.floor(
      (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
        Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
        (1000 * 60 * 60 * 24)
    );
  }

  onSubmit = async event => {
    event.preventDefault();

    let error = false;
    if (this.state.campaignTarget <= 0) {
      this.setState({ targetError: true });
      error = true;
    } else {
      this.setState({ targetError: false });
    }
    if (this.state.minimumContribution <= 0) {
      this.setState({ minError: true });
      error = true;
    } else {
      this.setState({ minError: false });
    }
    if (this.date_diff_indays(this.state.endDate) < 0) {
      this.setState({ endDateError: true });
      error = true;
    } else {
      this.setState({ endDateError: false });
    }

    if (error) {
      this.setState({ formError: true });
      return;
    } else {
      this.setState({ formError: false });
    }

    this.setState({ loading: true, errorMessage: "" });

    try {
      const accounts = await web3.eth.getAccounts();
      const result = await factory.methods
        .createCampaign(this.calculateEther(this.state.minimumContribution))
        .send({
          from: accounts[0]
        });

      const formData = new FormData();
      formData.append("title", this.state.campaignName);
      formData.append("campaign_address", this.state.campaignAddress);
      formData.append("description", this.state.campaignDetails);
      formData.append("goal", this.calculateEther(this.state.campaignTarget));
      formData.append("image", this.state.selectedFile);
      formData.append("tags", this.state.tags);
      formData.append("end_date", this.state.endDate);
      formData.append("campaign_subheader", this.state.campaignSubHeader);
      formData.append("creator_name", this.state.creatorName);
      formData.append("campaigner_address", accounts[0]);
      for (var pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }
      // PUT call to Database
      const url =
        "https://backable-db.herokuapp.com/api/v1/new-campaign-submit/";
      fetch(url, {
        method: "PUT",
        body: formData
      });
      this.setState({start:Date.now()});
      while (this.state.time < 1000){
        this.setState({time: Date.now() - this.state.start});
      }
      Router.pushRoute("/campaigns/" + this.state.campaignAddress);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  fileChangedHandler = event => {
    this.setState({ selectedFile: event.target.files[0] });
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = e => {
        this.setState({ image: e.target.result });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  render() {
    const errors = validate(
      this.state.campaignName,
      this.state.creatorName,
      this.state.campaignSubHeader,
      this.state.endDate,
      this.state.image,
      this.state.campaignDetails,
      this.state.tags,
      this.state.campaignTarget,
      this.state.minimumContribution
    );
    const isEnabled = !Object.keys(errors).some(x => errors[x]);
    return (
      <Grid centered>
        <Grid.Row center aligned verticalAlign="bottom">
          <Grid.Column width={12}>
            <h3>Create a Campaign</h3>

            <Form
              onSubmit={this.onSubmit}
              error={
                this.state.minError ||
                this.state.targetError ||
                this.state.endDateError
              }
            >
              <Form.Field>
                <Form.Input
                  required={true}
                  label="Campaigner Name"
                  placeholder="Enter Your Name"
                  value={this.state.creatorName}
                  onChange={event =>
                    this.setState({ creatorName: event.target.value })
                  }
                />
              </Form.Field>

              <Form.Field>
                <Form.Input
                  required={true}
                  label="Campaign Name"
                  placeholder="Enter a title for your campaign"
                  value={this.state.campaignName}
                  onChange={event =>
                    this.setState({ campaignName: event.target.value })
                  }
                />
              </Form.Field>

              <Form.Field>
                <Form.Input
                  required={true}
                  label="Campaigner Sub Header"
                  placeholder="Enter a one liner about campaign"
                  value={this.state.campaignSubHeader}
                  onChange={event =>
                    this.setState({ campaignSubHeader: event.target.value })
                  }
                />
              </Form.Field>

              <Form.Field>
                <Form.Input
                  required={true}
                  label="Campaigner End Date"
                  type="date"
                  value={this.state.endDate}
                  onChange={event =>
                    this.setState({ endDate: event.target.value })
                  }
                />
              </Form.Field>
              {this.state.endDateError ? (
                <Message
                  error
                  header="Invalid Date"
                  content="Please input a future date"
                />
              ) : null}

              <Form.Field>
                <Form.Input
                  required={true}
                  label="Campaigner Photo"
                  type="file"
                  accept=".jpeg,.jpg"
                  onChange={this.fileChangedHandler.bind(this)}
                />
                <img
                  style={{ width: "100%" }}
                  id="target"
                  src={this.state.image}
                />
              </Form.Field>

              <Form.Field required>
                <label>Campaign Details</label>
                <textarea
                  placeholder="Enter your campaign details"
                  value={this.state.campaignDetails}
                  onChange={event =>
                    this.setState({ campaignDetails: event.target.value })
                  }
                />
              </Form.Field>

              <Form.Field>
                <Form.Input
                  required={true}
                  label="Tags"
                  placeholder="Enter a tag"
                  value={this.state.tags}
                  onChange={event =>
                    this.setState({ tags: event.target.value })
                  }
                />
              </Form.Field>

              <Form.Field required>
                <label>Campaign Target</label>
                <Input
                  placeholder="Enter your campaign goal"
                  type="number"
                  value={this.state.campaignTarget}
                  onChange={event =>
                    this.setState({ campaignTarget: event.target.value })
                  }
                  label="SGD"
                  labelPosition="right"
                />
              </Form.Field>
              <p>
                Converts to{" "}
                {this.calculateEther(this.state.campaignTarget).toFixed(6)} ETH
              </p>
              {this.state.targetError ? (
                <Message
                  error
                  header="Invalid Amount"
                  content="Please input a amount larger than 0."
                />
              ) : null}

              <Form.Field required>
                <label>Minimum Contribution</label>
                <Input
                  placeholder="Enter an amount"
                  type="number"
                  label="SGD"
                  labelPosition="right"
                  value={this.state.minimumContribution}
                  onChange={event =>
                    this.setState({ minimumContribution: event.target.value })
                  }
                />
              </Form.Field>
              <p>
                Converts to{" "}
                {this.calculateEther(this.state.minimumContribution).toFixed(6)}{" "}
                ETH
              </p>
              {this.state.minError ? (
                <Message
                  error
                  header="Invalid Amount"
                  content="Please input a amount larger than 0."
                />
              ) : null}
              {this.state.errorMessage ? (
                <Message
                  error
                  header="Error in Submitting"
                  content={this.state.errorMessage}
                />
              ) : null}

              <Button
                fluid
                circular
                color="green"
                disabled={!isEnabled}
                loading={this.state.loading}
                size="huge"
              >
                Create!
              </Button>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default CampaignNew;
