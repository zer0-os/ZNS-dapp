import React, { FC, useState, useCallback } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useZnsContracts } from '../../../lib/contracts';
import { useDomainCache } from '../../../lib/useDomainCache';
import { useDomainStore } from '../../../lib/useDomainStore';
import { Modal, Button, Tabs } from 'antd';
import Claim from '../shop/claims';
import Create from '../../table/create';
import Transfer from '../../transferDomains';
import Approve from '../../table/NFT-View/approval';
import { Link, useLocation } from 'react-router-dom';
import _ from 'lodash';
import TableImage from '.././../table/table-image';
import '../../css/shop.scss';
import Outgoing from './outGoingApproval';
const { TabPane } = Tabs;

interface ShopProps {
  domain: string;
}

const Shop: FC<ShopProps> = ({ domain: _domain }) => {
  const [isShopVisible, setShopVisible] = useState(false);
  const [outgoingPendingCount, setOutgoingPendingCount] = useState(0);
  const [size, setSize] = useState();
  const context = useWeb3React<Web3Provider>();
  const contracts = useZnsContracts();
  const { library, account, active, chainId } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain } = domainContext;
  const { owned, incomingApprovals } = useDomainStore();
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

  const outgoingApprovals = owned.isJust()
    ? owned.value.filter((control) => {
        return control.approval.isJust();
      })
    : null;

  const showShop = () => {
    setShopVisible(true);
  };

  const shopOk = () => {
    setShopVisible(false);
  };

  const shopCancel = () => {
    setShopVisible(false);
  };

  const gridCell = () => {
    return (
      <div className="Cellgrid">
        <div className="Topcell"> </div>
        <div className="Bottomcell">
          <div className="TextTopcell"></div>
          <div className="TextMiddlecell">ticker</div>
          <div className="TextBottomcell">
            <span>Left</span>
            <span>Right</span>
          </div>
        </div>
      </div>
    );
  };

  const cells: any = [];
  cells.push(gridCell());
  cells.push(gridCell());
  cells.push(gridCell());
  cells.push(gridCell());
  cells.push(gridCell());
  cells.push(gridCell());
  cells.push(gridCell());
  cells.push(gridCell());
  if (owned.isNothing()) return null;
  return (
    <>
      {owned.isJust() && (
        <button className="btn-shop" onClick={showShop}>
          Shop
        </button>
      )}
      <Modal
        visible={isShopVisible}
        onOk={shopOk}
        onCancel={shopCancel}
        footer={null}
      >
        <Tabs
          defaultActiveKey="1"
          size={size}
          style={{ marginBottom: 32 }}
          tabPosition={'left'}
        >
          <TabPane tab="NFTs You Own" key="1">
            <div className="gridContainer-profile">{cells}</div>
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
          <TabPane tab="NFTs You've Made" key="2">
            <div>
              <h1>
                Incoming Approvals:{' '}
                {incomingApprovals.isJust()
                  ? incomingApprovals.value.length
                  : 0}{' '}
              </h1>
            </div>

            <div>
              <Claim />
            </div>
          </TabPane>

          <TabPane tab="Offers You've Made" key="3">
            <div className="listOut">
              <div>
                <h1>
                  Outgoing Approvals:
                  {outgoingApprovals ? outgoingApprovals.length : 0}{' '}
                </h1>
              </div>

              <Outgoing />
            </div>
          </TabPane>
          <TabPane tab="Offers Made To You" key="4">
            <div>
              <h1>
                Incoming Approvals:{' '}
                {incomingApprovals.isJust()
                  ? incomingApprovals.value.length
                  : 0}{' '}
              </h1>
            </div>

            <div>
              <Claim />
            </div>
          </TabPane>
        </Tabs>

        {console.log('OWNED ', owned)}
      </Modal>
    </>
  );
};
export default Shop;