//- React Imports
import React, { useState, useEffect, useRef, useContext, createContext } from 'react'

//- Context Imports
import { NFTContextData, NFTContextDataDefault, NFTContext } from './NFTContext'
import useMint from 'lib/hooks/useMint'

//- Web3 Imports
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { useDomainCache } from 'lib/useDomainCache'

//- Library Imports
import { randomName } from 'lib/Random'

//- Component Imports
import { StepBar, ToggleSection, TextInput, FutureButton } from 'components'
import TokenInformation from './sections/TokenInformation'
import TokenDynamics from './sections/TokenDynamics'

//- Style Imports
import styles from './MintNewNFT.module.css'

type MintNewNFTProps = {
	domainId: string; // Blockchain ID of the domain we're minting to
	domainName: string; // The name of the domain we're minting to, i.e. wilder.world
	onMint: () => void;
}

const MintNewNFT: React.FC<MintNewNFTProps> = ({ domainId, domainName, onMint }) => {

	// NOTE: The only domain data MintNewNFT needs is the domain ID

	//- Mint Context
	const { mint } = useMint()

	//- NFT Context
	const [ nftName, setNftName ] = useState('')
	const [ nftTicker, setNftTicker ] = useState('')
	const [ nftStory, setNftStory ] = useState('')
	const [ nftImage, setNftImage ] = useState(Buffer.from(''))
	const [ nftDynamic, setNftDynamic ] = useState(false)
	const [ nftDomain, setNftDomain ] = useState('')
	const [ nftLocked, setNftLocked ] = useState(false)
	const NFTContextValue = {
		name: nftName,
		setName: setNftName,
		ticker: nftTicker,
		setTicker: setNftTicker,
		story: nftStory,
		setStory: setNftStory,
		image: nftImage,
		setImage: setNftImage,
		dynamic: nftDynamic,
		setDynamic: setNftDynamic,
		domain: nftDomain,
		setDomain: setNftDomain,
		locked: nftLocked,
		setLocked: setNftLocked,
	}

	//- Page State
	const [ step, setStep ] = useState(1)
	const steps = 3

	//- Web3 Wallet Data
	// MintNewNFT is a container and needs a bit more brainpower than your standard component
	// I think using Context API for account data here is worthwhile
	const context = useWeb3React<Web3Provider>()
	const { account } = context // account = connected wallet ID

	//- Functions
	const toStep = (i: number) => {setStep(i >= steps ? steps : i)}
	const submit = () => {
		// Verify that all fields exist
		const { name, ticker, story, image, dynamic } = NFTContextValue
		if(name.length && ticker.length && story.length && image && dynamic != null) {
			mint({
				name: name,
				ticker: ticker,
				story: story,
				image: image,
				dynamic: dynamic,
				domain: domainName,
			})
			onMint()
		}
	}

	return (
		<div className={`${styles.MintNewNFT} blur border-rounded border-primary`}>
			<NFTContext.Provider value={ NFTContextValue } >
				{/* // TODO: Pull each section out into a seperate component */}
				<div className={styles.Header}>
					<h1 className={`glow-text-white`}>Mint "{nftName ? nftName : 'A New NFT'}"</h1>
					<div style={{marginBottom: 16}}>
						<h2 className={`glow-text-white`}>wilder.{domainName && domainName.length ? `${domainName.substring(1)}` : ``}{nftDomain}</h2>
					</div>
					<span>By {account && account.length ? randomName(account) : ''}</span>
				</div>
				<StepBar
					style={{marginTop: 24}}
					step={step}
					steps={['Details', 'Token Dynamics', 'Staking']}
				/>
				{/* TODO: Make ToggleSections unclickable if their open status depends on parent state */}

				{/* SECTION 1: Token Information */}
				{ step === 1 &&
					<TokenInformation onContinue={() => toStep(2)} />
				}

				{/* SECTION 2: Token Dynamics */}
				{ step === 2 && 
					<TokenDynamics onBack={() => toStep(1)} onContinue={() => toStep(3)} />
				}

				{/* SECTION 3: Staking */}
				{ step === 3 &&
					<>
						<p style={{marginTop: 16, textAlign: 'center'}}>Middleware call not linked up - waiting for middleware to be finished</p>
						<FutureButton 
							style={{margin: '0 auto 0 auto', height: 36, borderRadius: 18 }}
							onClick={submit}
							glow
						>Mint NFT</FutureButton>
					</>
				}
			</NFTContext.Provider>
		</div>
	)
}

export default MintNewNFT