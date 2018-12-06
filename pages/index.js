import React, { Component } from "react";
import { Card, Button } from "semantic-ui-react";

import factory from "../ethereum/factory";
import { Link } from "../src/routes";
import styles from "./index.css.js";

const fetch = require("node-fetch");

let num_campaigns = 10;

class CampaignIndex extends Component {
  static async getInitialProps() {
    let test = {};

    let headers = {
      num_entities: num_campaigns
    };

    await fetch("https://backable-db.herokuapp.com/api/v1/get-campaigns", {
      method: "GET",
      headers: headers
    })


    let campaign_array = [];
    let campaign_addresses = Object.keys(test);

    campaign_addresses.forEach(function(key) {
      test[key]["campaign_address"] = key;
      campaign_array.push(test[key]);
    });

    // console.log(campaign_array);

    const campaigns = await factory.methods.getDeployedCampaigns().call();
    // console.log(campaigns);
    return { campaigns, test, campaign_addresses, campaign_array };
  }

  // getCampaignInfo() {
  //     // The address of the campaign to be sent in the header
  //     let myheaders = {
  //         // USE this for when create campaign has been finished
  //         // "campaign_address":  this.props.address ,
  //
  //         // This is hardcoded placedholder address, needs to change
  //         campaign_address: "0xcF01071DB0CAB2CBeE4A8C21BB7638aC1FA1c38c"
  //     };
  //
  //     // GET call to Database
  //     fetch("https://backable-db.herokuapp.com/api/v1/get-campaign", {
  //         method: "GET",
  //         headers: myheaders
  //     })
  //         .then(response => response.json())
  //         .then(data => {
  //             // Update the data state with db values
  //             this.setState({
  //                 data_campaigner_name: "Jason Bourne",
  //                 data_sub_header: "A short description of your project and what it is",
  //                 data_enddate: "12/31/2018",
  //
  //                 data_title: data["title"],
  //                 data_description: data["description"],
  //                 data_campaigner_address: data["campaigner_address"],
  //                 // data_goal: data["goal"],
  //                 data_goal: "50",
  //                 data_tags: data["tags"],
  //                 data_img: data["image_url"]
  //             });
  //             console.log(data);
  //         });
  // }

  createLink(eth_address) {
    return "https://rinkeby.etherscan.io/address/" + eth_address;
  }

  renderCampaigns() {
    const card = this.props.campaign_array.map(campaign => ({
      image: campaign["image_url"],
      header: campaign["title"],
      extra: campaign["campaign_address"],
      description: (
        <div>
          <p>{campaign["description"]}</p>

          <Link route={`/campaigns/${campaign["campaign_address"]}`}>
            <a>View Campaign</a>
          </Link>
        </div>
      ),
      fluid: true,
      raised: true
      // link: true
    }));

    //
    // for (let i = 0; i < this.props.campaign_array.length; i++) {
    //
    //     const card = this.props.test[i].map(campaign => ({
    //         image: campaign['image_url'],
    //         header: "Title of campaign",
    //         extra: address,
    //         description: (
    //             <div>
    //                 <p>A Short description of the campaign and what is it about</p>
    //
    //                 <Link route={`/campaigns/${address}`}>
    //                     <a>View Campaign</a>
    //                 </Link>
    //             </div>
    //         ),
    //         fluid: true
    //     }));
    // }

    return <Card.Group items={card} />;
  }

  // renderCampaignsCards() {
  //     const items = this.props.campaigns.map(address => ({
  //         image: "https://via.placeholder.com/400x270",
  //         header: "Title of campaign",
  //         extra: address,
  //         description: (
  //             <div>
  //                 <p>A Short description of the campaign and what is it about</p>
  //
  //                 <Link route={`/campaigns/${address}`}>
  //                     <a>View Campaign</a>
  //                 </Link>
  //             </div>
  //         ),
  //         fluid: true
  //     }));
  //
  //     return <div items={items}/>;
  // }

  render() {
    return (
      <div>
        <h3>Open Campaigns</h3>

        <Link route="/campaigns/new">
          <a>
            <Button
              floated="right"
              content="Create Campaign"
              icon="add circle"
              primary
            />
          </a>
        </Link>

        {this.renderCampaigns()}
      </div>
    );
  }
}

export default CampaignIndex;
