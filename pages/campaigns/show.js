import React, { Component, Fragment } from "react";
import {
  Card,
  Grid,
  Button,
  Segment,
  Progress,
  Container,
  SegmentGroup
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
      data_tags: ""
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

  componentDidMount() {
    // The address of the campaign to be sent in the header
    let myheaders = {
      // USE this for when create campaign has been finished
      // "campaign_address":  this.props.address ,

      // This is hardcoded placedholder address, needs to change
      campaign_address: "0xcF01071DB0CAB2CBeE4A8C21BB7638aC1FA1c38c"
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
          data_campaigner_name: "Jason Bourne",
          data_sub_header: "A short description of your project and what it is",
          data_enddate: "12/31/2018",

          data_title: data["title"],
          data_description: data["description"],
          data_campaigner_address: data["campaigner_address"],
          // data_goal: data["goal"],
          data_goal: "50",
          data_tags: data["tags"],
          data_img: data["image_url"]
        });
        console.log(data);
      });
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
      manager: summary[4]
    };
  }

  render() {
    return (
      <Fragment>
        <Grid verticalAlign="middle" centered>
          <Grid.Row center aligned stretched>
            <Grid.Column width={10}>
              <Segment.Group>
                <Segment>
                  <h1>{this.state.data_title}</h1>
                  <h4>{this.state.data_sub_header}</h4>
                </Segment>
                <Segment>
                  <p>{this.props.address}</p>
                </Segment>
              </Segment.Group>
            </Grid.Column>

            <Grid.Column width={6}>
              <Segment.Group>
                <Segment>{this.state.data_campaigner_name}</Segment>
                <Segment
                  style={{ flexDirection: "row", overflowWrap: "break-word" }}
                >
                  {" "}
                  {this.props.manager}
                </Segment>
              </Segment.Group>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={10}>
              <img src={this.state.data_img} alt="Banner" height="200" />
            </Grid.Column>
            <Grid.Column width={6}>
              <Segment.Group>
                <Segment>
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
                    ).toFixed(2)}{" "}
                    ETH
                  </h3>
                  <p>pledged of {this.state.data_goal} ETH goal</p>
                </Segment>

                <Segment>
                  <h3 style={styles.approverStyle}>
                    {this.props.approversCount}
                  </h3>
                  <p>backers</p>
                </Segment>

                <Segment>
                  <h3 style={styles.approverStyle}>
                    {this.date_diff_indays(this.state.data_enddate)}
                  </h3>
                  <p>days left</p>
                </Segment>
              </Segment.Group>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={10} floated="left">
              <Segment>
                <p>{this.state.data_description}</p>
              </Segment>
            </Grid.Column>
            <Grid.Column width={6} floated="right">
              <Segment>
                <Grid.Row>
                  <ContributeForm address={this.props.address} />
                </Grid.Row>
              </Segment>

              <Segment>
                <Grid.Row>
                  <Link route={`/campaigns/${this.props.address}/requests`}>
                    <a>
                      <Button primary>View Requests</Button>
                    </a>
                  </Link>
                </Grid.Row>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Fragment>
    );
  }
}

export default CampaignShow;
