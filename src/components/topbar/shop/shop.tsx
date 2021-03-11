import { FC, useState, useMemo } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useZnsContracts } from '../../../lib/contracts';
import { useDomainCache } from '../../../lib/useDomainCache';
import { useDomainStore } from '../../../lib/useDomainStore';
import { Modal, Tabs } from 'antd';
import Approve from '../../table/NFT-View/approval';
import { useLocation } from 'react-router-dom';
import _ from 'lodash';
import '../../css/shop.scss';
import Outgoing from './outGoingApproval';
import Claims from './claims';
import Stakingview from '../stakingModal';
import tripledot from '../../css/img/tripledot.svg';

const { TabPane } = Tabs;

interface ShopProps {
  domain: string;
}

const Shop: FC<ShopProps> = ({ domain: _domain }) => {
  const [isShopVisible, setShopVisible] = useState(false);
  const [isTransferVisible, setTransferVisible] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [outgoingPendingCount, setOutgoingPendingCount] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [size, setSize] = useState();
  const context = useWeb3React<Web3Provider>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const contracts = useZnsContracts();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { library, account, active, chainId } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain } = domainContext;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { owned, refetchOwned } = useDomainStore();
  const location = useLocation();
  const [isStakingVisible, setStakingVisible] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const showStaking = () => {
    setStakingVisible(true);
  };

  const stakingOk = () => {
    setStakingVisible(false);
  };

  const stakingCancel = () => {
    setStakingVisible(false);
  };

  const showShop = () => {
    setShopVisible(true);
  };

  const shopOk = () => {
    setShopVisible(false);
  };

  const shopCancel = () => {
    setShopVisible(false);
  };

  const showTransfer = () => {
    setTransferVisible(true);
  };

  const transferOk = () => {
    setTransferVisible(false);
  };

  const transferCancel = () => {
    setTransferVisible(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const gridCell = (name: string, image: any) => {
    return (
      <div className="gridCell">
        <div className="topCell">
          <img
            className="cellImage"
            src={image.replace('ipfs://', 'https://ipfs.io/ipfs/')}
            alt=""
          />
        </div>
        <div className="bottomCell">
          {/* <div className="name">{name}</div> */}
          <div className="name">{name.match(/[^.]+$/)}</div>
          <div className="domain">O::/{name}</div>
          <div className="desc">
            <div className="ticker">Ticker</div>
            <div className="holders">X Holders</div>
          </div>
          <div className="price">$1234.00</div>
          <div className="bottom">
            <span className="eth-price">(Ξ 1.0015)</span>
            <span className="cell-btn">
              <img onClick={showTransfer} src={tripledot} alt="" />
              <Modal
                visible={isTransferVisible}
                onOk={transferOk}
                onCancel={transferCancel}
                footer={null}
                width={'65vw'}
                closable={false}
              >
                <Approve domain={_domain} />
              </Modal>
            </span>
          </div>
        </div>
      </div>
    );
  };

  const allOwned = useMemo(
    () =>
      owned.isNothing()
        ? []
        : owned.value.map((control) => {
          return gridCell(control.domain, control.image);
        }),
    [gridCell, owned],
  );

  // const cells: any = [];
  // cells.push(gridCell());
  // cells.push(gridCell());
  // cells.push(gridCell());
  // cells.push(gridCell());
  // cells.push(gridCell());
  // cells.push(gridCell());
  // cells.push(gridCell());
  // cells.push(gridCell());
  if (owned.isNothing() && domain.isNothing()) return null;
  return (
    <>
      {owned.isJust() && (
        <button className="btn-shop" onClick={showShop}>
          Shop
        </button>
      )}
      <Modal
        className="noModalPadding"
        style={{
          position: 'relative',
          margin: 0,
          marginBottom: 0,
          padding: 0,
          background: 'none',
        }}
        bodyStyle={{
          height: '90vh',
          background: 'none',
          marginBottom: 0,
        }}
        closeIcon={null}
        width={'90vw'}
        centered
        visible={isShopVisible}
        onOk={shopOk}
        onCancel={shopCancel}
        footer={null}
        closable={false}
      >
        <div className="shopContainer">
          <Tabs
            className="tabs"
            defaultActiveKey="1"
            // size={size}
            tabPosition={'left'}
          >
            <TabPane
              className="tabPane firstPane"
              tab="NFTs You Own"
              key="1"
              style={{ overflow: 'auto', height: '90vh' }}
            >
              <div className="gridContainer-profile">{allOwned}</div>

              <button
                id="more"
                onClick={showTransfer}
                style={{ display: 'none' }}
              >
                {' '}
                Transfer{' '}
              </button>
              <Modal
                visible={isTransferVisible}
                onOk={transferOk}
                onCancel={transferCancel}
                footer={null}
                width={'65vw'}
                closable={false}
              >
                <Approve domain={_domain} />
              </Modal>

              {/* <Owned /> */}
              {/* <div>
              {owned.value.map((control) => {
                return (
                  <div key={control.domain}>
                    <Link
                      to={'/' + control.domain} 
                      //   key={control.domain}
                    >
                      {control.domain}
                    </Link>
                  </div>
                );
              })}
            </div>{' '} */}
            </TabPane>

            <TabPane
              className="tabPane secondPane"
              tab="NFTs You've Made"
              key="2"
              style={{ overflow: 'auto', height: '90vh' }}
            >
              <div className="listOut">
                <div className="gridContainer-profile">domains</div>
              </div>
            </TabPane>
            <TabPane
              className="tabPane thirdPane"
              tab="Offers You've Made"
              key="3"
              style={{ overflow: 'auto', height: '90vh' }}
            >
              <Outgoing />
            </TabPane>
            <TabPane
              className="tabPane fourthPane"
              tab="Offers Made To You"
              key="4"
              style={{ overflow: 'auto', height: '90vh' }}
            >
              {/* <div>
              <h1>
                Incoming Approvals:{' '}
                {incomingApprovals.isJust()
                  ? incomingApprovals.value.length
                  : 0}{' '}
              </h1>
            </div> */}

              <Claims />
            </TabPane>
          </Tabs>
          <button className="mintNFT" onClick={showStaking}>
            Mint NFT
          </button>
          <Modal
            visible={isStakingVisible}
            onOk={stakingOk}
            onCancel={stakingCancel}
            footer={null}
            closable={false}
          >
            <Stakingview domain={_domain} />
          </Modal>
        </div>
      </Modal>
    </>
  );
};
export default Shop;
