import { FC, useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';
import { useDomainCache } from '../../../lib/useDomainCache';
import { Column, useTable, useGlobalFilter, useFilters } from 'react-table';
import TableImage from './table-image';
import SearchTable from './searchTable';
import marketimg from '../css/img/chart.svg';
import Grid from './grid-view';
import { Modal } from 'antd';
import './css/subdomains.scss';
import '../mockup/image.scss';
import graph1 from './img/mockgraphs/graph1.png';
import graph2 from './img/mockgraphs/graph2.png';
import graph3 from './img/mockgraphs/graph3.png';
import graph4 from './img/mockgraphs/graph4.png';
import graph5 from './img/mockgraphs/graph5.png';
import FutureButton from '../../Buttons/FutureButton/FutureButton.js';
import Enlist from '../../Enlist/Enlist';
import Image from '../../Image/Image';

import StaticEmulator from '../../../lib/StaticEmulator/StaticEmulator.js';

// IPFS Config
const ipfsLib = require('ipfs-api');
const ipfsClient = new ipfsLib({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
});

//
// Please Read
// Much data availability of the table has changed throughout versions of this app, and the MVP version removes essentially all of the data to be replaced with the Last Bid, No Bids, and Last Sales Price field. In lieu of deleting these fields, which may retain their usefulness at some point in the future, I have commented them out, so that they may be used when they prove useful. If you still have your code editor set to horizontal scrolling, than all I can say is git gud.
//

interface Data {
  '#': string;
  asset: any;
  name: string;
  // '24Hr': any;
  // '7d': any;
  // marketcap: string;
  // volume: string;
  // supply: string;
  // last7days: any;
  lastbid: string;
  nobids: string;
  lastsale: string;
  timestamp: any;
  trade: any;
}

interface TProps {
  domain: string;
  gridView: boolean;
  search: string;
}

const TableView: FC<TProps> = ({ domain: _domain, gridView, search }) => {
  // const context = useWeb3React<Web3Provider>();
  // const { account } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { name } = domainContext;
  const history = useHistory();
  const [image, setImage] = useState('');
  const [descript, setDescription] = useState(null);
  const subdomains = !name.isNothing() ? name.value.subdomains : [];
  const [imageCount, setImageCount] = useState(0);
  const [enlist, setEnlist] = useState('');
  const closeEnlist = () => setEnlist('');

  //- Getting image data for all subdomains
  useEffect(() => {
    const ipfsreq = async () => {
      if (name.isNothing() || !subdomains.length) return;
      // Get each subdomain and pull its metadata from IPFS
      for (var i = 0; i < subdomains.length; i++) {
        const sub = subdomains[i];
        if (!sub.image) {
          const d = JSON.parse(await ipfsClient.cat(sub.metadata.slice(21)));
          sub.image = d.image;
          sub.nftName = d.name;
          sub.nftDescription = d.description;
          setImageCount(i + 1);
        }
      }
    };
    ipfsreq();
  }, [name]);
  //
  // Following functions generate random numbers to display mock data in the UI
  //

  const randThreeS = () => {
    let temp =
      Math.random() > 0.5
        ? Math.floor(Math.random() * 1000).toString()
        : Math.floor(Math.random() * 100).toString();
    if (temp === '0') {
      temp = '10';
    }
    return temp;
  };

  const randThree = () => {
    let temp = Math.floor(Math.random() * 1000).toString();
    if (temp.length === 1) {
      temp = '00' + temp;
    }
    if (temp.length === 2) {
      temp = '0' + temp;
    }
    return temp;
  };

  const randVol = () => {
    let temp =
      (Math.floor(Math.random() * 99) + 1).toString() +
      ',' +
      randThree() +
      ',' +
      randThree();
    return temp;
  };

  const randPrice = () => {
    let temp = Math.floor(Math.random() * 100).toString();
    let dot = Math.floor(Math.random() * 100).toString();
    if (dot.length === 1) {
      dot = '0' + dot;
    }
    let up = Math.random() > 0.3;
    let price = `${up ? '▲' : '▼'} ${temp}.${dot}%`;
    return (
      <div style={{ color: `${up ? '#27AE60' : '#EB5757'}` }}>{price}</div>
    );
  };

  const randTrade = () => {
    let digits = Math.random() > 0.5;
    let temp;
    digits
      ? (temp =
          (Math.floor(Math.random() * 2) + 1).toString() + ',' + randThree())
      : (temp = randThreeS());
    let dec = Math.floor(Math.random() * 100).toString();
    if (dec.length === 1) {
      dec = '0' + dec;
    }
    return '$' + temp + '.' + dec;
  };

  const randGraph = () => {
    let temp = Math.floor(Math.random() * 10);
    if (temp === 0 || temp === 1) {
      return graph1;
    } else if (temp === 2 || temp === 3) {
      return graph2;
    } else if (temp === 4 || temp === 5) {
      return graph3;
    } else if (temp === 6 || temp === 7) {
      return graph4;
    } else if (temp === 8 || temp === 9) {
      return graph5;
    } else return graph5;
  };

  //
  //
  //

  const dataInput: Data[] = useMemo(
    () =>
      name.isNothing()
        ? []
        : _.map(name.value.subdomains, (key, i) => ({
            key: key.name,
            '#': (i + 1).toString(),
            // asset: <Profile domain={key} />,
            asset: (
              <div className="neo-demo">
                <Image src={key.image} alt="" className="neo2" />
              </div>
            ),
            name: key.name,
            // '24Hr': randPrice(),
            // '7d': randPrice(),
            // marketcap: `$${randThreeS()},${randThree()},${randThree()}`,
            // volume: '$' + randVol(),
            // supply: `${randThreeS()},${randThree()},${randThree()} TICK`,
            // last7days: <img src={randGraph()} alt="" />,
            lastbid: '',
            nobids: '',
            lastsale: '',
            timestamp: '',
            trade: (
              <FutureButton
                glow
                onClick={() => setEnlist(key.name)}
                style={{
                  height: 36,
                  width: 118,
                  borderRadius: 18,
                  zIndex: 1000,
                }}
              >
                ENLIST
              </FutureButton>
            ),
          })),

    [name, imageCount, image],
  );

  const data = useMemo<Data[]>(() => dataInput, [dataInput]);

  const columns = useMemo<Column<Data>[]>(
    () => [
      {
        Header: <div>#</div>,
        accessor: '#',
      },
      {
        Header: 'Name',
        accessor: 'asset',
      },
      {
        Header: '',
        accessor: 'name',
        width: '100%',
      },
      // { Header: '24Hr', accessor: '24Hr' },
      // { Header: '7d', accessor: '7d' },
      // {
      //   Header: (
      //     <div className="infoHeader">
      //       <span>Market Cap </span>
      //       <span className="infoButton">
      //         <span className="infoMark">?</span>
      //       </span>
      //     </div>
      //   ),
      //   accessor: 'marketcap',
      // },
      // {
      //   Header: (
      //     <div className="infoHeader">
      //       <span>Volume </span>
      //       <span className="infoButton">
      //         <span className="infoMark">?</span>
      //       </span>
      //     </div>
      //   ),
      //   accessor: 'volume',
      // },
      // {
      //   Header: (
      //     <div className="infoHeader">
      //       <span>Supply </span>
      //       <span className="infoButton">
      //         <span className="infoMark">?</span>
      //       </span>
      //     </div>
      //   ),
      //   accessor: 'supply',
      // },

      // {
      //   Header: 'Last 7 Days',
      //   accessor: 'last7days',
      // },
      {
        Header: '',
        accessor: 'lastbid',
      },
      {
        Header: '',
        accessor: 'nobids',
      },
      {
        Header: '',
        accessor: 'lastsale',
      },
      {
        Header: '',
        accessor: 'timestamp',
        width: '0px',
        Cell: () => <div style={{ display: 'none' }}></div>,
      },
      {
        Header: '',
        accessor: 'trade',
      },
    ],
    [],
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      // defaultColumn,
      // initialState: {
      //   hiddenColumns: ['timestamp'],
      // },
    },
    useFilters,
    useGlobalFilter,
    // useAbsoluteLayout,
  );

  const handleRowClick = (e: any, row: any) => {
    if (e.target.nodeName.toLowerCase() === 'button') return;
    history.push({
      pathname: row.original.key,
    });
  };
  if (name.isNothing()) return null;

  //console.log(domain.value.children, 'xxxxxxxxxxxxxxxxx');
  return (
    <div className="shiftTableUp">
      <SearchTable globalFilter={search} setGlobalFilter={setGlobalFilter} />

      {!gridView ? (
        <div className="tableContainer">
          <table {...getTableProps()} className="subdomainsTable localTable">
            {rows.length === 0 ? null : (
              <thead className="subdomainsHeaderGroupLocal">
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
              {/*console.log('ROWS', rows)*/}

              {
                // Loop over the table rows
                rows.map((row) => {
                  // Prepare the row for display
                  prepareRow(row);
                  return (
                    // Apply the row props
                    <tr {...row.getRowProps()}>
                      {
                        // Loop over the rows cells
                        row.cells.map((cell) => {
                          // Apply the cell props
                          return (
                            <td
                              onClick={(e: any) => handleRowClick(e, row)}
                              className="tdLocal"
                              {...cell.getCellProps()}
                            >
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
                  <td>
                    <div
                      style={{
                        color: '#fff',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        marginTop: 20,
                      }}
                    >
                      Nothing to see here!
                    </div>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      ) : (
        <Grid domain={_domain} />
      )}
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

      <Modal
        visible={enlist.length > 0}
        onOk={closeEnlist}
        centered
        onCancel={closeEnlist}
        closable={false}
        footer={null}
        width={640}
      >
        <Enlist
          name={enlist}
          props={{
            image: StaticEmulator(
              enlist.split('.')[enlist.split('.').length - 1],
            ),
            close: closeEnlist,
          }}
        />
      </Modal>
    </div>
  );
};

export default TableView;
