import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";
// "0xCA7740C40E82f945D4e48b9Cf2475c2674B2813D"
const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x097626C87D290e5F5fB9124fbcF527eA55986685"
);

export default instance;
