//- React Imports
import React, { useState, useEffect } from 'react';

//- Web3 Imports
import { useDomainCache } from 'lib/useDomainCache'; // Domain data
import { useWeb3React } from '@web3-react/core'; // Wallet data
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider'; // Wallet data

//- Component Imports
import { ArrowLink, FutureButton, Member, Image, Overlay } from 'components';
import { MakeABid } from 'containers';

//- Library Imports
import { randomName, randomImage } from 'lib/Random';
import useNotification from 'lib/hooks/useNotification';
import { useBidProvider } from 'lib/providers/BidProvider';
import { wildToUsd } from 'lib/coingecko';
import { useCurrencyProvider } from 'lib/providers/CurrencyProvider';

//- Style Imports
import styles from './NFTView.module.css';

//- Asset Imports
import galaxyBackground from './assets/galaxy.png';
import copyIcon from './assets/copy-icon.svg';
import { Maybe } from 'true-myth';
import { DisplayParentDomain, Bid } from 'lib/types';
import { chainIdToNetworkType, getEtherscanUri } from 'lib/network';
import { BigNumber } from 'ethers';
import { useZnsContracts } from 'lib/contracts';
const moment = require('moment');

type NFTViewProps = {
	domain: string;
};

const NFTView: React.FC<NFTViewProps> = ({ domain }) => {
	// TODO: NFT page data shouldn't change before unloading - maybe deep copy the data first

	//- Notes:
	// It's worth having this component consume the domain context
	// because it needs way more data than is worth sending through props

	const { addNotification } = useNotification();
	const { wildPriceUsd } = useCurrencyProvider();

	//- Page State
	const [zna, setZna] = useState('');
	const [image, setImage] = useState<string>(''); // Image from metadata url
	const [name, setName] = useState<string>(''); // Name from metadata url
	const [description, setDescription] = useState<string>(''); // Description from metadata url
	const [isOwnedByYou, setIsOwnedByYou] = useState(false); // Is the current domain owned by you?
	const [isImageOverlayOpen, setIsImageOverlayOpen] = useState(false);
	const [isBidOverlayOpen, setIsBidOverlayOpen] = useState(false);
	const [bids, setBids] = useState<Bid[]>([]);
	const [highestBid, setHighestBid] = useState<Bid | undefined>();
	const [highestBidUsd, setHighestBidUsd] = useState<number | undefined>();

	//- Web3 Domain Data
	const { useDomain } = useDomainCache();
	const domainContext = useDomain(domain.substring(1));
	const data: Maybe<DisplayParentDomain> = domainContext.data;
	const { getBidsForDomain } = useBidProvider();

	//- Web3 Wallet Data
	const walletContext = useWeb3React<Web3Provider>();
	const { account, chainId } = walletContext;

	const networkType = chainIdToNetworkType(chainId);
	const contracts = useZnsContracts();
	const registrarAddress = contracts ? contracts.registry.address : '';
	const domainId = data.isNothing()
		? ''
		: BigNumber.from(data.value.id).toString();
	const etherscanBaseUri = getEtherscanUri(networkType);
	const etherscanLink = `${etherscanBaseUri}token/${registrarAddress}?a=${domainId}`;

	//- Functions
	const copyContractToClipboard = () => {
		addNotification('Copied address to clipboard.');
		navigator.clipboard.writeText(domainId);
	};

	const openBidOverlay = () => {
		if (data.isNothing()) return;
		setIsBidOverlayOpen(true);
	};

	const closeBidOverlay = () => setIsBidOverlayOpen(false);

	const onBid = async (bid: Bid) => {
		// @todo switch this to live data
		// should refresh on bid rather than add mock data
		setBids([...bids, bid]);
		setHighestBid(bid);
		closeBidOverlay();
		const bidUsd = await wildToUsd(bid.amount);
		setHighestBidUsd(bidUsd);
	};

	useEffect(() => {
		if (!data.isNothing() && data.value.metadata && !data.value.image) {
			setIsOwnedByYou(data.value.owner.id === account);

			getBidsForDomain(data.value).then(async (bids) => {
				if (!bids || !bids.length) return;
				try {
					const sorted = bids.sort((a, b) => b.amount - a.amount);
					setBids(sorted);
					setHighestBid(sorted[0]);
					setHighestBidUsd(sorted[0].amount * wildPriceUsd);
				} catch (e) {
					console.error('Failed to retrive bid data');
				}
			});

			// Get metadata
			fetch(data.value.metadata).then(async (d: Response) => {
				const nftData = await d.json();
				setZna(domain);
				setImage(nftData.image);
				setName(nftData.title || nftData.name);
				setDescription(nftData.description);
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	/////////////////////
	// React Fragments //
	/////////////////////

	const overlays = () => (
		<>
			<Overlay
				centered
				img
				open={isImageOverlayOpen}
				onClose={() => setIsImageOverlayOpen(false)}
			>
				<Image
					src={image}
					style={{
						width: 'auto',
						maxHeight: '80vh',
						maxWidth: '80vw',
						objectFit: 'contain',
						textAlign: 'center',
					}}
				/>
			</Overlay>

			{data.isJust() && (
				<Overlay onClose={closeBidOverlay} centered open={isBidOverlayOpen}>
					<MakeABid domain={data.value} onBid={onBid} />
				</Overlay>
			)}
		</>
	);

	const price = () => (
		<>
			{highestBid && (
				<div className={styles.Price}>
					<h2 className="glow-text-blue">Highest Bid</h2>
					<span className={styles.Crypto}>
						{Number(highestBid.amount.toFixed(2)).toLocaleString()} WILD{' '}
						{highestBidUsd && (
							<span className={styles.Fiat}>
								(${Number(highestBidUsd.toFixed(2)).toLocaleString()})
							</span>
						)}
					</span>
				</div>
			)}
		</>
	);

	const history = () => (
		<section
			className={`${styles.History} ${styles.Box} blur border-primary border-rounded`}
		>
			<h4>History</h4>
			<ul>
				{bids.map((bid: Bid) =>
					historyItem(bid.bidderAccount, bid.amount, bid.date),
				)}
			</ul>
		</section>
	);

	const historyItem = (account: string, amount: number, date: Date) => (
		<li className={styles.Bid} key={date.toString()}>
			<div>
				<b>
					<a
						className="alt-link"
						href={`https://etherscan.io/${account}`}
						target="_blank"
						rel="noreferrer"
					>{`${account.substring(0, 4)}...${account.substring(
						account.length - 4,
					)}`}</a>
				</b>{' '}
				bidded <b>{Number(amount.toFixed(2)).toLocaleString()} WILD</b>
			</div>
		</li>
	);

	const actionButtons = () => (
		<div className={styles.Buttons}>
			<FutureButton
				glow={isOwnedByYou}
				onClick={() => {}}
				style={{ height: 36, borderRadius: 18 }}
			>
				Transfer Ownership
			</FutureButton>
			<FutureButton
				glow={!isOwnedByYou}
				onClick={openBidOverlay}
				style={{ height: 36, borderRadius: 18 }}
			>
				Make A Bid
			</FutureButton>
		</div>
	);

	////////////
	// Render //
	////////////

	return (
		<div className={styles.NFTView}>
			{overlays()}
			<div
				className={`${styles.NFT} blur border-primary border-rounded`}
				style={{ backgroundImage: `url(${galaxyBackground})` }}
			>
				<div className={`${styles.Image} border-rounded`}>
					<Image
						style={{
							height: 422,
							borderRadius: 10,
							borderWidth: 2,
						}}
						className="border-primary border-radius"
						src={image}
						onClick={() => setIsImageOverlayOpen(true)}
					/>
				</div>
				<div className={styles.Info}>
					<div>
						<h1 className="glow-text-white">{name}</h1>
						<span>
							{zna.length > 0 ? `0://wilder.${zna.substring(1)}` : ''}
						</span>
						<div className={styles.Members}>
							<Member
								id={!data.isNothing() ? data.value.owner.id : ''}
								name={!data.isNothing() ? randomName(data.value.owner.id) : ''}
								image={
									!data.isNothing() ? randomImage(data.value.owner.id) : ''
								}
								subtext={'Owner'}
							/>
							<Member
								id={!data.isNothing() ? data.value.minter.id : ''}
								name={!data.isNothing() ? randomName(data.value.minter.id) : ''}
								image={
									!data.isNothing() ? randomImage(data.value.minter.id) : ''
								}
								subtext={'Creator'}
							/>
						</div>
					</div>
					{price()}
					{actionButtons()}
				</div>
			</div>
			<div className={styles.Horizontal} style={{ marginTop: 20 }}>
				<div
					className={`${styles.Box} ${styles.Story} blur border-primary border-rounded`}
				>
					<h4>Story</h4>
					<p>{description}</p>
				</div>
				<div
					className={`${styles.Box} ${styles.Contract} blur border-primary border-rounded`}
				>
					<h4>Token Id</h4>
					<p className="glow-text-white">
						<img
							onClick={copyContractToClipboard}
							className={styles.Copy}
							src={copyIcon}
							alt={'Copy Contract Icon'}
						/>
						{domainId}
					</p>
					<ArrowLink
						style={{
							marginTop: 8,
							width: 140,
							fontWeight: 700,
						}}
						href={etherscanLink}
					>
						View on Etherscan
					</ArrowLink>
				</div>
			</div>
			{history()}
		</div>
	);
};

export default NFTView;
