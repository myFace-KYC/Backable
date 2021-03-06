import React, { Component, Fragment } from "react";
import {
  Card,
  Grid,
  Button,
  Segment,
  Progress,
  Container,
  SegmentGroup,
  GridRow,
  GridColumn
} from "semantic-ui-react";

import Campaign from "../../ethereum/campaign";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../src/components/ContributeForm";
import { Link } from "../../src/routes";
import styles from "./show.css.js";

class CampaignShow extends Component {
  /*
Example of returned JSON
campaigner_address: ""0xcF01971DB0CAB2CBeE4A8C21BB7638aC1FA1c38c""
description: ""Cheap and afforable flying cars for everyone""
goal: ""1000000""
image_url: "https://firebasestorage.googleapis.com/v0/b/backable-5ceed.appspot.com/o/images%2F%220xcF01971DB0CAB2CBeE4A8C21BB7638aC1FA1c38c%22.jpg?alt=media&token=1"
tags: ""cars""
title: ""Flying Cars For Everyone""
*/

  constructor(props) {
    super(props);
    // Data state that stores the variables to be obtained from the db
    this.state = {
      data_title: "",
      data_sub_header: "",
      data_img: "",
      data_description: "",
      data_campaigner_address: "",
      data_campaigner_name: "",
      data_goal: 0,
      data_endTime: "",
      data_tags: "",
      data_backerList: [],
      data_eth_conv_rate: 0
    };
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
  calculateEther(val) {
    var val_in_ether;
    if (val == "") {
      val_in_ether = 0;
    } else {
      val_in_ether = parseFloat(val) * this.state.data_eth_conv_rate;
    }
    return val_in_ether;
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
      });
    // The address of the campaign to be sent in the header
    let myheaders = {
      // USE this for when create campaign has been finished

      //"campaign_address":  this.props.address ,
      // This is hardcoded placedholder address, needs to change
      //campaign_address: "0xcF01071DB0CAB2CBeE4A8C21BB7638aC1FA1c38c"

      campaign_address: this.props.address
      // This is hardcoded placedholder address, needs to change
      // campaign_address: "0xcF01071DB0CAB2CBeE4A8C21BB7638aC1FA1c38c"
    };

    // GET call to Database
    fetch("https://backable-db.herokuapp.com/api/v1/get-campaign", {
      method: "GET",
      headers: myheaders
    })
      .then(response => response.json())
      .then(data => {
        // Update the data state with db values
        this.setState({
          data_campaigner_name: data["creator_name"],
          data_sub_header: data["campaign_subheader"],
          data_enddate: data["end_date"],

          data_title: data["title"],
          data_description: data["description"],
          data_campaigner_address: data["campaigner_address"],
          // data_goal: data["goal"],
          data_goal: data["goal"],
          data_tags: data["tags"],
          data_img: data["image_url"]
        });
        console.log(data);
      });
  }

  createLink(eth_address) {
    return "https://rinkeby.etherscan.io/address/" + eth_address;
  }

  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address);
    const summary = await campaign.methods.getSummary().call();

    return {
      address: props.query.address,
      minimumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4],
      data_backerList: summary[5]
    };
  }

  render() {
    return (
      <Fragment>
        <Grid columns="equal" centered>
          <Grid.Row center aligned verticalAlign="bottom">
            <Grid.Column width={8}>
              <div style={styles.containerHeaderSegment}>
                <div style={styles.singleHeaderSegment}>
                  <h1>{this.state.data_title}</h1>
                  <h4>{this.state.data_sub_header}</h4>
                </div>
                <div style={styles.addressSegment}>
                  <a href={this.createLink(this.props.address)}>
                    {this.props.address}
                  </a>
                </div>
              </div>
            </Grid.Column>

            <Grid.Column width={5}>
              <div style={styles.containerSegment}>
                <div style={styles.singleSegment}>Created by</div>
                <div style={styles.addressOverflow}>
                  <h4>{this.state.data_campaigner_name}</h4>
                </div>
                <div style={styles.addressOverflow}>
                  <a href={this.createLink(this.props.manager)}>
                    {this.props.manager}
                  </a>
                </div>
              </div>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row centered verticalAlign="middle">
            <Grid.Column width={8}>
              <img
                style={styles.picSegment}
                src={this.state.data_img}
                alt="Banner"
              />
            </Grid.Column>
            <Grid.Column width={5}>
              <div style={styles.containerSegment}>
                <div style={styles.singleSegment}>
                  <Progress
                    style={styles.progressbar}
                    color="violet"
                    percent={
                      (parseFloat(
                        web3.utils.fromWei(this.props.balance, "ether")
                      ).toFixed(2) /
                        this.state.data_goal) *
                      100
                    }
                    indicating
                  />
                  <h3 style={styles.approverStyle}>
                    {parseFloat(
                      web3.utils.fromWei(this.props.balance, "ether")
                    ).toFixed(4)}{" "}
                    ETH
                  </h3>
                  <p>
                    {parseFloat(
                      this.calculateEther(
                        web3.utils.fromWei(this.props.balance, "ether")
                      )
                    ).toFixed(2)}{" "}
                    SGD
                  </p>
                  <p>
                    pledged of {parseFloat(this.state.data_goal).toFixed(4)} ETH
                    goal
                  </p>
                </div>

                <div style={styles.singleSegment}>
                  <h3 style={styles.approverStyle}>
                    {this.props.approversCount}
                  </h3>
                  <p>backers</p>
                </div>

                <div style={styles.singleSegment}>
                  <h3 style={styles.approverStyle}>
                    {this.date_diff_indays(this.state.data_enddate)}
                  </h3>
                  <p>days left</p>
                </div>
              </div>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row center stretched>
            <Grid.Column width={8}>
              <div style={styles.containerSegment}>
                <p style={styles.singleSegment}>
                  {this.state.data_description}
                </p>
              </div>
            </Grid.Column>
            <Grid.Column width={5}>
              <div style={styles.contributeSegment}>
                <ContributeForm address={this.props.address} />
                <div style={styles.viewRequest}>
                  <Link route={`/campaigns/${this.props.address}/requests`}>
                    <a>
                      <Button fluid primary>
                        View Requests
                      </Button>
                    </a>
                  </Link>
                  <p style={{ paddingTop: "20px" }}>
                    {"Minimum contribution amount: "}
                    <b>
                      {(
                        parseFloat(
                          web3.utils.fromWei(
                            this.props.minimumContribution,
                            "ether"
                          )
                        ) * this.state.data_eth_conv_rate
                      ).toFixed(2)}
                      {" SGD"}
                    </b>
                  </p>
                </div>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Fragment>
    );
  }
}

export default CampaignShow;
