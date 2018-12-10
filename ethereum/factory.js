import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";
// "0xAd0ce68eae4Ec0b518d07856Dc2d74A5780643de" "0x196c7afe4EF53F73e3f377a90a5fcb38ea754544"
const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0xB3E122dFDA93f21e9CeE89215fA9653555679D25"
);

export default instance;
