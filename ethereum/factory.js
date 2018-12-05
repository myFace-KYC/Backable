import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";
// "0xCA7740C40E82f945D4e48b9Cf2475c2674B2813D"
const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x196c7afe4EF53F73e3f377a90a5fcb38ea754544"
);

export default instance;
