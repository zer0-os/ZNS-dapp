import React, { FC, useState, useMemo, useEffect } from 'react';
import _ from 'lodash';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Link, useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { useZnsContracts } from '../../lib/contracts';
import { useDomainCache } from '../../lib/useDomainCache';
import Transfer from '../transferDomains';
import Create from '../topbar/create';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Modal, Button } from 'antd';
import Owned from '../topbar/shop/owned';
import { String } from 'lodash';
import {
  Column,
  useTable,
  usePagination,
  useGlobalFilter,
  useAsyncDebounce,
} from 'react-table';
import { string } from 'zod';
import Profile from './NFT-View/nft-view';
import Approve from './NFT-View/approval';
import TableViewGlobal from './tableView-global';
import SearchTable from './searchTable';
import SetImage from '../topbar/forms/set-image';
import linebutton from '../css/img/threelinebutton.png';
import squarebutton from '../css/img/squaregridbutton.png';
import linebuttongrey from '../css/img/threelinebuttongrey.png';
import squarebuttonwhite from '../css/img/squaregridbuttonwhite.png';
import filter from '../css/img/filter.svg';
import Search from 'antd/lib/input/Search';

interface DomainsGlobalProps {
  domain: string;
}

interface Data {
  '#': string;
  '': any;
  network: string;
  token: string;
  volume: string;
  '24Hr': string;
  '7d': string;
  marketcap: string;
  last7days: string;
  trade: string;
}

const DomainsGlobal: FC<DomainsGlobalProps> = ({ domain: _domain }) => {
  const context = useWeb3React<Web3Provider>();

  const location = useLocation();
  const contracts = useZnsContracts();
  const { account } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain } = domainContext;
  const history = useHistory();
  const dataInput: Data[] = [];
  const [gridView, toggleGridView] = useState(false);

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

  useEffect(() => {
    console.log('ChildView', domain);
  }, [domain]);
  // const showSubdomain = () => {
  //   setSubdomainVisible(true);
  // };

  // const subdomainOk = () => {
  //   setSubdomainVisible(false);
  // };

  // const subdomainCancel = () => {
  //   setSubdomainVisible(false);
  // };

  // const handleRowClick = (record: any) => {
  //   history.push({
  //     pathname: record.name,
  //   });
  // };
  const metric = (
    name: string,
    price: string,
    unit: string,
    percent: string,
  ) => {
    return (
      <div className="metricBlock">
        <div className="metric">
          <div className="metricField">{name}</div>
          <div className="metricField">{price}</div>
          <div className="metricField">
            {unit} <span className="metricPercent">{percent}</span>
          </div>
        </div>
      </div>
    );
  };

  const colors: string[] = [
    '641f29',
    'cf7571',
    '171730',
    '953338',
    '8f6554',
    '584362',
    '754735',
    '8e7384',
    '979b9f',
    '1a3344',
    '0f1619',
    '224564',
    '33566d',
    'b8bdca',
    '76b1ce',
    '678293',
    '426582',
    '414350',
    '675b67',
  ];
  if (domain.isNothing()) return null;
  return (
    <div>
      <div className="metricsBar">
        <div className="metricsTitle">Metrics</div>
        <div className="metricsContainer">
          {metric('WILDER PRICE', '$2,000', '@0.0410', '(+41.10%)')}
          {metric('WILDER PRICE', '$2,000', '@0.0410', '(+41.10%)')}
          {metric('WILDER PRICE', '$2,000', '@0.0410', '(+41.10%)')}
          {metric('WILDER PRICE', '$2,000', '@0.0410', '(+41.10%)')}
          {metric('WILDER PRICE', '$2,000', '@0.0410', '(+41.10%)')}
          {metric(
            'MARKET CAP',
            '$369,000,101',
            'Fully diluted market cap for WILD',
            '',
          )}
        </div>
      </div>

      <div id="subdomainsContainer">
        <div className="subdomainsSortBar">
          <div className="route-nav">
            <div className="route-nav-link">
              {/* <div>ZNS</div> */}
              <Link className="route-nav-text" to={'/'}>
                0::/
              </Link>
            </div>
            {routes.map(([key, path], i) => (
              <div className="route-nav-link">
                <Link className="route-nav-text-sub" to={path}>
                  {key}
                  {i < routes.length - 1 && '.'}
                </Link>
              </div>
            ))}
          </div>
          <div className="subdomainsButtonSortContainer">
            <div className="subdomainsButtonSortLeft">
              <div className="sdbslItem sdbslItemSelected">Zero Networks</div>
              <div className="sdbslItem">NFTs</div>
              <div className="sdbslItem">DAOs</div>
              <div className="sdbslItem">Universes</div>
            </div>
            <div className="subdomainsButtonSortRight">
              {' '}
              <div
                onClick={() => toggleGridView(false)}
                className="sdbsrItem tableNavButton tnb2"
              >
                <img src={!gridView ? linebutton : linebuttongrey} alt="" />
              </div>
              <div
                onClick={() => toggleGridView(true)}
                className="sdbsrItem tableNavButton tnb1"
              >
                <img src={gridView ? squarebuttonwhite : squarebutton} alt="" />
              </div>
              {/* <div className="navFilter" style={{ marginBottom: '13px' }}>
                <span>
                  {' '}
                  <img src={filter} alt="" />
                </span>
                <span>Filter By</span>
                <span> </span>
              </div> */}
            </div>
          </div>
        </div>

        <TableViewGlobal domain={domain.value.domain} gridView={gridView} />

        {/* // apply the table props */}
      </div>
    </div>
  );
};

export default DomainsGlobal;
