//- React Imports
import React, { useState, useEffect } from 'react';

//- Library Imports
import { Domain, Bid } from 'lib/types';
import { useZnsContracts } from 'lib/contracts';
import { BigNumber, ethers } from 'ethers';

import * as zAuction from '../zAuction';

//- Hook Imports
import useNotification from 'lib/hooks/useNotification';
import { useWeb3React } from '@web3-react/core';

export const BidContext = React.createContext({
	getBidsForDomain: async (domain: Domain): Promise<Bid[] | undefined> => {
		return;
	},
	getBidsForYourDomains: async (): Promise<Bid[] | undefined> => {
		return;
	},
	getYourBids: async (): Promise<Bid[] | undefined> => {
		return;
	},
	placeBid: async (domain: Domain, bid: number): Promise<Bid | undefined> => {
		return;
	},
	acceptBid: async (bidId: string): Promise<void> => {
		return;
	},
});

type BidProviderType = {
	children: React.ReactNode;
};

/////////////////////
// Mock data stuff //
/////////////////////

const randomDate = () => {
	const start = new Date(2012, 0, 1);
	const end = new Date();
	return new Date(
		start.getTime() + Math.random() * (end.getTime() - start.getTime()),
	);
};

// Create some mock bids
export const getMock = (amount: number) => {
	const mockBids: Bid[] = [];
	[...Array(amount)].forEach((a: any) => {
		mockBids.push({
			amount: Math.random() * 10000,
			bidderAccount: `0x${Math.floor(Math.random() * 100000000000000000)}`,
			date: randomDate(),
		});
	});
	// Sort by recent
	return mockBids.sort((a, b) => {
		return b.date.valueOf() - a.date.valueOf();
	});
};

const asyncGetMock = async (amount: number, timeout: number) => {
	await new Promise((resolve) => setTimeout(resolve, timeout));
	return getMock(amount);
};

const BidProvider: React.FC<BidProviderType> = ({ children }) => {
	//////////////////////////
	// Hooks & State & Data //
	//////////////////////////

	const context = useWeb3React();
	const { addNotification } = useNotification();
	const contracts = useZnsContracts();

	const acceptBid = async (bidId: string) => {
		try {
			await new Promise((resolve) => setTimeout(resolve, 2000));
			addNotification(`Bid accepted`);
			return;
		} catch (e) {
			console.error(e);
			return;
		}
	};

	const getBidsForYourDomains = async () => {
		try {
			// @zachary
			// return bids from owned domains or undefined
			const mockBids = await asyncGetMock(5, 150);
			return mockBids;
		} catch (e) {
			console.error("Failed to retrieve bids for user's domains");
		}
	};

	const getYourBids = async () => {
		try {
			// @zachary
			// return bids placed by user or undefined
			// @TODO: Extend zAuction API to support this operation
			const mockBids = await asyncGetMock(5, 150);
			return mockBids;
		} catch (e) {
			console.error("Failed to retrieve bids for user's domains");
		}
	};

	const getBidsForDomain = async (domain: Domain) => {
		// Return mock until API is working
		const bids = await asyncGetMock(
			Math.floor(Math.random() * 10) + 1,
			Math.floor(Math.random() * 100) + 1200,
		);
		return bids;

		try {
			const bids = await zAuction.getBidsForNft(
				contracts!.registry.address,
				domain.id,
			);

			try {
				const displayBids = bids.map((e) => {
					const amount = Number(ethers.utils.formatEther(e.bidAmount));

					return {
						bidderAccount: e.bidder,
						amount,
						date: new Date(), // not supported by zAuction
					} as Bid;
				});

				// @TODO: Add filtering expired/invalid bids out
				return displayBids;
			} catch (e) {
				return [];
			}
		} catch (e) {
			console.error('Failed to retrive bids for domain ' + domain.id);
			return [];
		}
	};

	const placeBid = async (domain: Domain, bid: number) => {
		// Replace with bid functionality
		try {
			await zAuction.placeBid(
				context.library!,
				contracts!.registry.address,
				domain.id,
				ethers.utils.parseEther(bid.toString()).toString(),
			);

			addNotification(`Placed ${bid} WILD bid for ${domain.name}`);
			const mockBids = getMock(1);
			return mockBids[0];
		} catch (e) {
			console.error(e);
			return;
		}
	};

	const contextValue = {
		acceptBid,
		getBidsForDomain,
		getBidsForYourDomains,
		getYourBids,
		placeBid,
	};

	return (
		<BidContext.Provider value={contextValue}>{children}</BidContext.Provider>
	);
};

export default BidProvider;

export function useBidProvider() {
	const {
		acceptBid,
		getBidsForDomain,
		getBidsForYourDomains,
		getYourBids,
		placeBid,
	} = React.useContext(BidContext);
	return {
		acceptBid,
		getBidsForDomain,
		getBidsForYourDomains,
		getYourBids,
		placeBid,
	};
}
