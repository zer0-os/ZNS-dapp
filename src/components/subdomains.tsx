import React, { FC, useState, useMemo } from 'react';
import _ from 'lodash';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Link, useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { useZnsContracts } from '../lib/contracts';
import { useDomainCache } from '../lib/useDomainCache';
import Transfer from './transferDomains';
import Create from './create';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Modal, Button } from 'antd';
import Owned from './owned';
import { String } from 'lodash';
import { Column, useTable, UseTableOptions } from 'react-table';
import { string } from 'zod';
import Profile from './profileIcon';
import Approve from './approval';
import SetImage from './forms/set-image';

interface SubdomainsProps {
  domain: string;
}

interface ColumnProps {
  key: number;
  name: string;
}
interface RowProps {
  id: number;
  domain: string;
}

interface Data {
  '#': string;
  asset: any;
  name: string;
  volume: string;
  '24Hr': string;
  '7d': string;
  marketcap: string;
  last7days: string;
  trade: string;
}

const Subdomains: FC<SubdomainsProps> = ({ domain: _domain }) => {
  const context = useWeb3React<Web3Provider>();
  const location = useLocation();
  const contracts = useZnsContracts();
  const { account } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain } = domainContext;
  const history = useHistory();

  const routes = useMemo(
    () =>
      _.transform(
        location.pathname
          .substr(1)
          .split('.')
          .filter((s) => s !== ''),
        (acc: [string, string][], val, i) => {
          let next = 0 < i ? acc[i - 1][1] + '.' + val : val;
          acc.push([val, next]);
        },
      ),
    [location.pathname],
  );

  const dataInput: Data[] = useMemo(
    () =>
      domain.isNothing()
        ? []
        : _.keys(domain.value.children).map((key) => ({
            '#': key,
            asset: <Profile domain={domain.value.domain} />,
            name: domain.value.children[Number(key)],
            volume: 'N/A',
            '24Hr': 'N/A',
            '7d': 'N/A',
            marketcap: 'N/A',
            last7days: '',
            trade: '',
          })),
    [domain],
  );

  const data = useMemo<Data[]>(() => dataInput, [dataInput]);
  const columns = useMemo<Column<Data>[]>(
    () => [
      {
        Header: '#',
        accessor: '#',
      },
      {
        Header: 'Asset',
        accessor: 'asset',
      },
      { Header: 'Name', accessor: 'name' },
      { Header: 'Volume', accessor: 'volume' },
      { Header: '24Hr', accessor: '24Hr' },
      { Header: '7d', accessor: '7d' },
      { Header: 'Market Cap', accessor: 'marketcap' },
      { Header: 'Last 7 Days', accessor: 'last7days' },
      { Header: 'Trade', accessor: 'trade' },
    ],
    [],
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  const options = {
    onRowClick: (rowData: any) =>
      history.push({
        pathname: rowData[0],
      }),
    filter: false,
    selectableRowsHideCheckboxes: true,
    sort: false,
  };

  const handleRowClick = (row: any) => {
    console.log('fire');
    console.log(row);
    history.push({
      pathname: row.values.name,
    });
  };

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
    '675b68',
  ];
  console.log('r', routes);
  if (domain.isNothing()) return <p>Loading</p>;

  return (
    <div id="subdomainsContainer">
      <img
        style={{ height: '10%', width: '10%' }}
        src={domain.value.image.replace('ipfs://', 'https://ipfs.io/ipfs/')}
      />
      <SetImage domain={domain.value.domain} />
      <div className="route-nav">
        <div className="route-nav-link">
          <Link to={'/'}>Z:/</Link>{' '}
        </div>
        {routes.map(([key, path], i) => (
          <div className="route-nav-link">
            <Link to={path}>{' ' + key + ' '}</Link>
            <div>{i < routes.length - 1 && ' . '}</div>
          </div>
        ))}
      </div>

      {account?.toLowerCase() === domain.value.owner.toLowerCase() ? (
        <>
          <div>
            <Create domainId={domain.value.id} domainContext={domainContext} />
          </div>
          <div>
            <Transfer
              domainId={domain.value.id}
              domainContext={domainContext}
            />
          </div>
        </>
      ) : null}
      {/* // apply the table props */}
      <div className="tableContainer">
        <table {...getTableProps()} className="subdomainsTable">
          {rows.length === 0 ? null : (
            <thead className="subdomainsHeaderGroup">
              {
                // Loop over the header rows
                headerGroups.map((headerGroup) => (
                  // Apply the header row props
                  <tr
                    className="subdomainsHeaderTR"
                    {...headerGroup.getHeaderGroupProps()}
                  >
                    {
                      // Loop over the headers in each row
                      headerGroup.headers.map((column) => (
                        // Apply the header cell props
                        <th
                          className="subdomainsHeaderTH"
                          {...column.getHeaderProps()}
                        >
                          {
                            // Render the header
                            column.render('Header')
                          }
                        </th>
                      ))
                    }
                  </tr>
                ))
              }
            </thead>
          )}
          {/* Apply the table body props */}
          <tbody {...getTableBodyProps()}>
            {console.log('ROWS', rows)}

            {
              // Loop over the table rows
              rows.map((row) => {
                // Prepare the row for display
                prepareRow(row);
                return (
                  // Apply the row props
                  <tr
                    onClick={() => handleRowClick(row)}
                    {...row.getRowProps()}
                  >
                    {
                      // Loop over the rows cells
                      row.cells.map((cell) => {
                        // Apply the cell props
                        return (
                          <td {...cell.getCellProps()}>
                            {
                              // Render the cell contents
                              cell.render('Cell')
                            }
                          </td>
                        );
                      })
                    }
                  </tr>
                );
              })
            }
          </tbody>
          {rows.length !== 0 ? null : (
            <tfoot>
              <tr>
                <td>Footer text displays here when there are no subdomains</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      <br />
      <br />
      {/* {colors.map((color) => {
        return (
          <div
            style={{
              background: '#' + color,
              height: '40px',
              width: '80%',
              textAlign: 'right',
            }}
          >
            {color}
          </div>
        );
      })} */}
    </div>
  );
};

export default Subdomains;
