/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Column, useTable, useGlobalFilter, useFilters } from 'react-table';

//- Component Imports
import {
	Artwork,
	Confirmation,
	FilterButton,
	FutureButton,
	Image,
	OptionDropdown,
	Overlay,
	Member,
	SearchBar,
} from 'components';
import { Request } from 'containers';

//- Library Imports
import { randomImage, randomName } from 'lib/Random';
import { DisplayDomain, Bid } from 'lib/types';
import { ethers } from 'ethers';
import { useBidProvider } from 'lib/providers/BidProvider';

//- Style Imports
import styles from './BidTable.module.css';

type BidTableProps = {
	style?: React.CSSProperties;
	userId: string;
};

enum Modals {
	Accept,
}

const BidTable: React.FC<BidTableProps> = ({ style, userId }) => {
	//////////////////
	// State / Refs //
	//////////////////

	const { acceptBid, getBidsForYourDomains, getYourBids } = useBidProvider();

	const containerRef = useRef<HTMLDivElement>(null);
	const [containerHeight, setContainerHeight] = useState(0); // Not needed anymore?

	// Searching
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('');
	const [domainFilter, setDomainFilter] = useState('');

	const [isLoading, setIsLoading] = useState(false); // Not needed anymore?
	const [modal, setModal] = useState<Modals | undefined>();
	const [acceptingBid, setAcceptingBid] = useState<Bid | undefined>();

	//////////
	// Data //
	//////////

	const [bidsOnYourDomains, setBidsOnYourDomains] = useState<Bid[]>([]);
	const [yourBids, setYourBids] = useState<Bid[]>([]);
	const [displayData, setDisplayData] = useState<Bid[]>([]);
	useEffect(() => {
		// @ zachary
		// this table is a bit weird - need to get
		// domain data for each bid. ill try get to this one

		const get = async () => {
			try {
				const allBids = await Promise.all([
					getBidsForYourDomains(),
					getYourBids(),
				]);
				setBidsOnYourDomains(allBids[0] || []);
				setYourBids(allBids[1] || []);
				const flat = allBids.flat();
				if (flat) setDisplayData(flat as Bid[]);
				else setDisplayData([]);
			} catch (e) {
				console.error('Failed to retrieve bid data');
			}
		};
		get();
	}, []);

	///////////////
	// Functions //
	///////////////

	/* Sets some search parameters
		 There's a hook listening to each of these variables */
	const search = (query: string) => setSearchQuery(query);
	const filterByStatus = (filter: string) => console.log(filter);
	const filterByDomain = (filter: string) => console.log(filter);

	const closeModal = () => setModal(undefined);

	const clickAcceptButton = (bid: Bid) => {
		setAcceptingBid(bid);
	};

	const acceptBidConfirmed = () => {
		setAcceptingBid(undefined);
	};

	const randomString = () => {
		return Math.random()
			.toString(36)
			.replace(/[^a-z]+/g, '')
			.substr(0, 5);
	};

	/////////////////
	// React-Table //
	/////////////////

	// Column Setup
	const columns = useMemo<Column<any>[]>(
		() => [
			{
				Header: () => <div style={{ textAlign: 'left' }}>Domain</div>,
				accessor: 'domain',
				Cell: () => (
					<Artwork
						id={randomString()}
						name={randomString()}
						image={'picsum.photos/seed/lorem/100/100'}
						domain={`0://${randomString()}.${randomString()}`}
						pending
					/>
				),
			},
			{
				Header: () => <div style={{ textAlign: 'right' }}>Highest Bid</div>,
				accessor: 'amount',
				Cell: (row) => (
					<div style={{ textAlign: 'right' }}>{row.value} WILD</div>
				),
			},
			{
				Header: () => <div style={{ textAlign: 'right' }}>Bidder</div>,
				accessor: 'bidderAccount',
				Cell: (row) => (
					<div
						style={{
							textAlign: 'right',
							display: 'flex',
							justifyContent: 'flex-end',
						}}
					>
						<Member
							id={row.value}
							name={randomName(row.value)}
							image={randomImage(row.value)}
						/>
					</div>
				),
			},
			{
				Header: () => <div style={{ textAlign: 'center' }}>Accept Bid</div>,
				id: 'bid',
				accessor: (bid: Bid) => (
					<FutureButton
						style={{ margin: '0 auto', textTransform: 'uppercase' }}
						glow
						onClick={() => clickAcceptButton(bid)}
					>
						Accept Bid
					</FutureButton>
				),
			},
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	// React-Table Config
	const tableHook = useTable<any>(
		{ columns, data: displayData },
		useFilters,
		useGlobalFilter,
	);
	const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
		tableHook;

	///////////////
	// Fragments //
	///////////////

	const modals = () => (
		<>
			<Overlay onClose={closeModal} centered open={acceptingBid !== undefined}>
				<Confirmation
					title={'Accept bid?'}
					onConfirm={acceptBidConfirmed}
					onCancel={closeModal}
				>
					<p>Some description here about what happens when you accept a bid</p>
				</Confirmation>
			</Overlay>
		</>
	);

	////////////
	// Render //
	////////////

	return (
		<div style={style} className={styles.RequestTableContainer}>
			{modals()}
			{/* Table Header */}
			<div className={styles.searchHeader}>
				<SearchBar
					onChange={(event: any) => search(event.target.value)}
					style={{ width: '100%', marginRight: 16 }}
				/>
				<div className={styles.searchHeaderButtons}>
					<OptionDropdown
						onSelect={filterByStatus}
						options={['All Statuses', 'Pending Bids', 'Accepted Bids']}
						drawerStyle={{ width: 179 }}
					>
						<FilterButton onClick={() => {}}>
							{statusFilter || 'All Statuses'}
						</FilterButton>
					</OptionDropdown>
				</div>
			</div>

			{/* Standard React-Table setup */}
			<div className={styles.RequestTable}>
				<div className={styles.Container} ref={containerRef}>
					{/* List View */}
					<table {...getTableProps()} className={styles.RequestTable}>
						<thead>
							{headerGroups.map((headerGroup) => (
								<tr {...headerGroup.getHeaderGroupProps()}>
									{headerGroup.headers.map((column) => (
										<th {...column.getHeaderProps()}>
											{column.render('Header')}
										</th>
									))}
								</tr>
							))}
						</thead>
						<tbody {...getTableBodyProps()}>
							{!isLoading &&
								rows.map((row) => {
									prepareRow(row);
									return (
										<tr
											onClick={() => console.log('Row click')}
											{...row.getRowProps()}
										>
											{row.cells.map((cell) => (
												<td {...cell.getCellProps()}>{cell.render('Cell')}</td>
											))}
										</tr>
									);
								})}
						</tbody>
					</table>
					{/* No Search Results Message */}
					{!isLoading &&
						(searchQuery.length > 0 || statusFilter.length > 0) &&
						displayData.length === 0 && (
							<p className={styles.Message}>No results!</p>
						)}

					{/* Data Loading Message */}
					{isLoading && (
						<p className={styles.Message}>Loading Domain Requests</p>
					)}

					{/* Empty Table Message */}
					{/* {!isLoading && requests.length === 0 && (
						<p className={styles.Message}>Nothing here!</p>
					)} */}
				</div>

				{/* Expander for animating height (@TODO Remove this functionality) */}
				<div
					style={{ height: containerHeight }}
					className={styles.Expander}
				></div>
			</div>
		</div>
	);
};

export default BidTable;
