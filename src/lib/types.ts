// Types

export interface Account {
	id: string;
}

export interface Domain {
	id: string;
	name: string;
	parent: string;
	owner: Account;
	minter: Account;
	metadata: string;
}

export interface Metadata {
	title: string;
	description: string;
	image: string;
}

export interface ParentDomain extends Domain {
	subdomains: SubDomain[];
}

export interface SubDomain extends Domain {}

export interface DomainRequest {
	id: string;
	parent: Domain;
	offeredAmount: string;
	requestUri: string;
	label: string;
	domain: string;
	requestor: Account;
	nonce: string;
	approved: boolean;
	fulfilled: boolean;
	timestamp: string;
}

export interface DisplayDomain extends Domain {
	image: string | undefined;
	description: string | undefined;
}

export interface DisplayParentDomain extends DisplayDomain {
	subdomains: DisplayDomain[];
}

// Parameters to create an NFT
export interface NftParams {
	owner: string;
	parent: string;
	zna: string;
	name: string;
	domain: string; // domain label
	ticker: string;
	story: string;
	image: Buffer;
	dynamic: boolean;
	locked: boolean;
}

// The contents of a Domain Request file that has been uploaded to IPFS
export interface DomainRequestContents {
	parent: string;
	domain: string; // domain label
	requestor: string;
	stakeAmount: string;
	stakeCurrency: string;
	metadata: string; // uri to metadata
	locked: boolean;
}

export interface DomainRequestAndContents {
	request: DomainRequest;
	contents: DomainRequestContents;
}

export interface DisplayDomainRequestAndContents
	extends DomainRequestAndContents {
	metadata: Metadata;
}

// Defaults

export const DefaultDomain: Domain = {
	id: '',
	name: '',
	parent: '',
	owner: {
		id: '',
	},
	minter: {
		id: '',
	},
	metadata: '',
};
