//- React Imports
import React, { useState, useEffect } from 'react'

//- Web3 Imports
import { useDomainCache } from 'lib/useDomainCache' // Domain data
import { useWeb3React } from '@web3-react/core' // Wallet data
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider' // Wallet data

//- Component Imports
import { FutureButton, Member, Image, Overlay } from 'components'

//- Library Imports
import IPFSClient from 'lib/ipfs-client'
import { randomName, randomImage } from 'lib/Random'

//- Style Imports
import styles from './NFTView.module.css'

//- Asset Imports
import galaxyBackground from './assets/galaxy.png'

type NFTViewProps = {
    domain: string;
}

const NFTView: React.FC<NFTViewProps> = ({ domain }) => {

    // TODO: NFT page data shouldn't change before unloading - maybe deep copy the data first

    //- Notes:
    // It's worth having this component consume the domain context
    // because it needs way more data than is worth sending through props

    //- Page State
    const [ image, setImage ] = useState<string>('') // Image from metadata url
    const [ name, setName ] = useState<string>('') // Name from metadata url
    const [ description, setDescription ] = useState<string>('') // Description from metadata url
    const [ isLoading, setIsLoading ] = useState<boolean>(false) // Is the data still loading?
    const [ isOwnedByYou, setIsOwnedByYou ] = useState(false) // Is the current domain owned by you?
    const [ isImageOverlayOpen, setIsImageOverlayOpen ] = useState(false)

    //- Web3 Domain Data
    const { useDomain } = useDomainCache()
    const domainContext = useDomain(domain.charAt(0) === '/' ? domain.substring(1) : domain)
    const { data } = domainContext
    
    //- Web3 Wallet Data
    const walletContext = useWeb3React<Web3Provider>()
    const { account } = walletContext

    useEffect(() => {
        if(!data.isNothing() && data.value.metadata && !data.value.image) {
            setIsOwnedByYou(data.value.owner.id === account)

            // Get metadata
            IPFSClient.cat(data.value.metadata.slice(21)).then((d: any) => {
                const nftData = JSON.parse(d)
                setImage(nftData.image)
                setName(nftData.title)
                setDescription(nftData.description)
                setIsLoading(false)
            })
        } else {
            setIsLoading(true)
        }
    }, [ data ])

    return(
        <div className={styles.NFTView}>

            <Overlay open={isImageOverlayOpen} onClose={() => setIsImageOverlayOpen(false)}><Image src={image} style={{maxWidth: 600}} /></Overlay>

            <div className={`${styles.NFT} blur border-primary border-rounded`} style={{backgroundImage: `url(${galaxyBackground})`}}>
                <div className={`${styles.Image} border-rounded`}>
                    <Image 
                        style={{width: 505, height: 422, borderRadius: 10, borderWidth: 2}} 
                        className='border-primary border-radius' 
                        src={image}
                        onClick={() => setIsImageOverlayOpen(true)}
                    />
                </div>
                <div className={styles.Info}>
                    <div>
                        <h1 className='glow-text-white'>{ name }</h1>
                        <a>0:/{ domain }</a>
                        <div className={styles.Members}>
                            <Member 
                                name={!data.isNothing() ? randomName(data.value.owner.id) : ''} 
                                image={!data.isNothing() ? randomImage(data.value.owner.id) : ''} 
                                subtext={'Owner'} />
                            <Member 
                                name={!data.isNothing() ? randomName(data.value.minter.id) : ''} 
                                image={!data.isNothing() ? randomImage(data.value.minter.id) : ''} 
                                subtext={'Creator'} 
                            />
                        </div>
                    </div>
                    <div className={styles.Price}>
                        <span className={styles.Crypto}>250 WILD <span className={styles.Fiat}>($1,304.12)</span></span>
                    </div>
                    <div className={styles.Buttons}>
                        <FutureButton 
                            glow={ isOwnedByYou }
                            onClick={() => {}}
                            style={{height: 36, borderRadius: 18}}
                        >Transfer Ownership</FutureButton>
                        <FutureButton 
                            glow={ !isOwnedByYou }
                            onClick={() => {}}
                            style={{height: 36, borderRadius: 18}}
                        >MAKE AN OFFER</FutureButton>
                    </div>
                </div>
            </div>
            <div className={styles.Horizontal} style={{marginTop: 20}}>
                <div className={`${styles.Box} ${styles.Story} blur border-primary border-rounded`}>
                    <h4>Story</h4>
                    <p>{ description }</p>
                </div>
                <div className={styles.Vertical}>
                    <div className={styles.Horizontal}>
                        <div className={`${styles.Box} blur border-primary border-rounded`}>
                            <h4>Views</h4>
                            <span className='glow-text-white'>1000</span>
                        </div>
                        <div className={`${styles.Box} blur border-primary border-rounded`}>
                            <h4>Edition</h4>
                            <span className='glow-text-white'>1 of 1</span>
                        </div>
                    </div>
                    <div className={`${styles.Box} ${styles.Contract} blur border-primary border-rounded`}>
                        <h4>Contract Address</h4>
                        <p className='glow-text-white'>{ !data.isNothing() && data.value.id ? data.value.id : '' }</p>
                    </div>
                </div>
            </div>
            <div>

            </div>
        </div>
    )

}

export default NFTView