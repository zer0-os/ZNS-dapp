import { FC, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useDomainCache } from '../../../lib/useDomainCache';
import { Link, useLocation } from 'react-router-dom';
import _ from 'lodash';
import '../../css/nftpage.scss';
import TableImage from '../table-image';
import NFTImage from './nft-image';
import neo2 from '../../css/img/neo2.jpeg';
import nFTpAGE from '../../css/video/nFTpAGE.mp4';
import neo from '../../css/img/mockusers/neo.png';
import cat from '../../css/img/mockusers/cat.png';
import phoenix from '../../css/img/mockusers/phoenix.png';
import vape from '../../css/img/mockusers/vape.png';
import wilder from '../../css/img/mockusers/wilder.png';

interface ProfileProps {
  domain: string;
}

const NFTPage: FC<ProfileProps> = ({ domain: _domain }) => {
  const [isNftVisible, setNftVisible] = useState(false);
  const context = useWeb3React<Web3Provider>();
  const { library, account, active, chainId } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain } = domainContext;
  const location = useLocation();

  const routes = _.transform(
    location.pathname
      .substr(1)
      .split('.')
      .filter((s) => s !== ''),
    (acc: [string, string][], val, i) => {
      let next = 0 < i ? acc[i - 1][1] + '.' + val : val;
      acc.push([val, next]);
    },
  );

  const showNft = () => {
    setNftVisible(true);
  };

  const nftOk = () => {
    setNftVisible(false);
  };

  const nftCancel = () => {
    setNftVisible(false);
  };

  const historyRow = (name: string, number: string, days: string, img: any) => {
    return (
      <div className="historyRow">
        <div className="historyLeft">
          <img src={img} alt="" className="avatar" />
          <div className="historyText">
            <span className="embolden">{name}</span> placed a bid for{' '}
            <span className="embolden">{number} WILD</span>
          </div>
        </div>
        <div className="historyRight">
          {days} days ago <span className="viewTx">[view tx]</span>
        </div>
      </div>
    );
  };

  if (domain.isNothing()) return null;
  return (
    // <div className="nftView">
    //   <div className="showcase"></div>
    //   <div className="info">
    //     <div className="story"></div>
    //     <div className="quad">
    //       <div className="top">
    //         <div className="last"></div>
    //         <div className="change"></div>
    //       </div>
    //       <div className="bottom">
    //         <div className="resale"></div>
    //         <div className="original"></div>
    //       </div>
    //     </div>
    //   </div>
    //   <div className="stats">
    //     <div className="growth"></div>
    //     <div className="market"></div>
    //   </div>
    //   <div className="bottom">
    //     <div className="chat"></div>
    //     <div className="history"></div>
    //   </div>
    // </div>
    <div className="nftView">
      <div className="showcase">
        <div className="showcaseIMG">
          {/* <NFTImage domain={domain.value.domain} /> */}
          <video
            playsInline={true}
            autoPlay={true}
            muted={true}
            loop={true}
            className=""
          >
            <source src={nFTpAGE} type="video/mp4" />
          </video>
        </div>
        <div className="showcaseInfo">
          <div className="top">
            <div className="title">Blue Pill / Red Pill</div>
            <div className="domain">
              {/* 0:/ / {domain.value.domain} */}

              <Link to={'/'} className="network">
                0:/ <span className="slash">/</span>
              </Link>
              {routes.length > 0 ? (
                // <div className="routeBox">
                <div className="route">
                  {routes.map(([key, path], i) => (
                    <Link key={key} className="route-nav-text-sub" to={path}>
                      {key}
                      {i < routes.length - 1 && '.'}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="users">
              <div className="creator">
                <img src={wilder} alt="" className="avatar" />
                <div className="creatorFlex">
                  <div className="creatorText">Frank Wilder</div>
                  <div className="desc">Creator</div>
                </div>
              </div>
              <div className="owner">
                <img src={neo} alt="" className="avatar" />
                <div className="ownerFlex">
                  <div className="ownerText">Neo Wilder</div>
                  <div className="desc">Owner</div>
                </div>
              </div>
            </div>
          </div>
          <div className="middle">
            <div className="midLeft">
              <div className="text">Price</div>
              <div className="units">250 LOOT</div>
              <div className="price">$1,304.12</div>
            </div>
            {/* <div className="midRight">
              <div className="text">Current Price</div>
              <div className="units">65,045 LOOT</div>
              <div className="price">$23,401,123.43</div>
            </div> */}
          </div>
          <div className="showcaseBottom">
            <div className="shadowContainer">
              <div className="makeOffer">
                <div>MAKE AN OFFER</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="info">
        <div className="story">
          <div>STORY</div>
          <div>
            To understand where we are, we must honor what has come before us.
            With NFTs catapulting Crypto into the mainstream, it shouldn’t be
            forgotten that the DeFi movement of 2020 helped pave the way.
            Digital art and crypto have served as a catalyst to one another
            reinventing modern art as we know it. With characters like n3o, the
            Wilders, Beeple and Elon all playing a significant role it’s only
            right we break bread to celebrate. While Mickey was so infatuated
            with the Wilder VR experience he didn’t take the time to eat, the
            other attendees enjoyed uni, sushi, pancake and pineapple on the set
            menu for the evening. With the NFT wave taking the world by storm,
            the Wilders have had a plan of their own... Wilder World will be
            opening as a fully interactive 3D world, with all characters present
            in the DeFi dinner game ready. We’ll be launching the immersive
            world with our next event, the first annual Cyber Gala in July 2021.
            The collector of this piece will be blessed with a custom fully
            functional "in world" avatar to roam Wilder World.
          </div>
        </div>
        <div className="quad">
          <div className="top">
            <div className="views">
              <div className="quadHeader">VIEWS</div>
              <div className="quadText">12,317</div>
            </div>
            <div className="edition">
              <div className="quadHeader">
                <span>EDITION</span>
                <span className="infoButton">
                  <span className="infoMark">?</span>
                </span>
              </div>
              <div className="quadText">1 of 1</div>
            </div>
          </div>
          <div className="address">
            <div className="quadHeader">
              <span>CONTRACT ADDRESS</span>
              <span className="infoButton">
                <span className="infoMark">?</span>
              </span>
            </div>
            <div className="quadText">
              0xbCC817f057950b0df41206C5D7125E6225Cae18e
            </div>
          </div>
        </div>
      </div>

      <div className="bottom">
        <div className="history">
          <div className="historyTitle">HISTORY</div>
          <div className="historyBox">
            {historyRow('Phoenix', '280', '4', phoenix)}
            {historyRow('Frank', '180', '6', wilder)}
            {historyRow('Neo', '50', '8', neo)}
            {historyRow('Cyber_Cat', '6', '8', cat)}
            {historyRow('Cyber_Cat', '200', '8', cat)}
            {historyRow('Frank', '230', '10', wilder)}
            {historyRow('888', '43', '10', vape)}
            {historyRow('Neo', '34', '11', neo)}
          </div>
        </div>
      </div>
    </div>
  );
};
export default NFTPage;
