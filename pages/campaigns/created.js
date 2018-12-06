import React, { Component } from "react";
import { Card, Button } from "semantic-ui-react";

// import factory from "../ethereum/factory";
import { Link } from "../../src/routes";
// import styles from "./created.css.js";
import web3 from "../../ethereum/web3";
import { Router } from "../../src/routes";

const fetch = require("node-fetch");

let accounts = [];

class CampaignIndex extends Component {
  onComponentDidMount() {
    console.log("TEST");
  }

  static async getInitialProps(props) {
    let campaigns_data = {};

    await web3.eth.getAccounts().then(address => (accounts = address));

    // console.log(await test);

    // (function loop() {
    //     if (web3.eth.accounts[0]) {
    //         console.log(web3.eth.accounts[0]);
    //     } else {
    //         console.log(web3.eth.getAccounts());
    //
    //         setTimeout(loop, 100);
    //     }
    // }());

    console.log(accounts);

    // console.log(accounts);

    let headers = {
      campaigner_address: await accounts[0]
    };

    await fetch("https://backable-db.herokuapp.com/api/v1/get-campaigner", {
      method: "GET",
      headers: headers
    })
      .then(response => {
        return response.json();
      }) // change to return response.text()
      .then(data => {
        campaigns_data = data;
      });

    if (!campaign_data) {
      let campaign_addresses = [];
      let campaign_array = [];
      return { campaign_addresses, campaign_array };
    }

    let campaign_addresses = [];
    let campaign_array = [];
    let hashes = Object.keys(campaigns_data);

    let campaign_data = {};

    hashes.forEach(function(address) {
      let headers = {
        campaign_address: address
      };

      fetch("https://backable-db.herokuapp.com/api/v1/get-campaign", {
        method: "GET",
        headers: headers
      })
        .then(response => {
          return response.json();
        }) // change to return response.text()
        .then(data => {
          campaign_data = data;
        });

      campaign_data["campaign_address"] = address;
      campaign_array.push(campaign_data);
    });

    console.log(campaign_array);

    // TODO: CALL BACKED AND CREATED CAMPAIGNS SEPARATELY

    return { campaign_addresses, campaign_array };
  }

  static createLink(eth_address) {
    return "https://rinkeby.etherscan.io/address/" + eth_address;
  }

  renderCampaigns() {
    if (this.props.campaign_array == []) {
      return "You haven't ";
    }

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

    return <Card.Group items={card} />;
  }

  render() {
    return (
      <div>
        <h3>Campaigns You've Created</h3>

        {/*<Link route="/campaigns/new">*/}
        {/*<a>*/}
        {/*<Button*/}
        {/*floated="right"*/}
        {/*content="Create Campaign"*/}
        {/*icon="add circle"*/}
        {/*primary*/}
        {/*/>*/}
        {/*</a>*/}
        {/*</Link>*/}

        {this.renderCampaigns()}

        <h3> Campaigns You've Backed</h3>

        {this.renderCampaigns()}
      </div>
    );
  }
}

export default CampaignIndex;
