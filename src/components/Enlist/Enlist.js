import React, { useState, FC } from 'react';

import StepBar from '../StepBar/StepBar.js';
import ToggleSection from '../ToggleSection/ToggleSection.js';
import TextInput from '../TextInput/TextInput.js';
import FutureButton from '../Buttons/FutureButton/FutureButton.js';

import styles from './Enlist.module.css';

// new
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useDomainCache } from '../../lib/useDomainCache';
import emailjs from 'emailjs-com';

const wildToUsd = 0.5; // Just a template for now

const Enlist = (props) => {
  // State
  const [emailAddress, setEmailAddress] = useState('');
  const [reasonForPurchase, setReasonForPurchase] = useState('');
  const [bidUsd, setBidUsd] = useState(0);

  // Form validation
  const isEmail = (text) =>
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      String(text).toLowerCase(),
    );
  const valid =
    isEmail(emailAddress) && reasonForPurchase.length > 0 && bidUsd > 0;

  const submit = () => {
    // Got all the form data here
  };

  function sendEmail(e) {
    emailjs
      .sendForm(
        'service_ht5ak0n',
        e.target,
        'template_t5hifjr',
        process.env.REACT_APP_EMAIL,
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        },
      );
    e.target.reset();
  }

  return (
    <div className={`${styles.Enlist} blur border-rounded border-primary`}>
      <div className={styles.Header}>
        <h1 className={`glow-text-white`}>Enlist To Purchase</h1>
        <div>
          <h2 className={`glow-text-white`}>0:/Wilder.NewNFT</h2>
          {/* <span>By Frank Wilder</span> */}
        </div>
      </div>
      <hr className="glow-line" />

      <form className={styles.Section}>
        <div style={{ display: 'flex' }}>
          <div className={styles.Inputs}>
            <TextInput
              placeholder={'Email Address'}
              name={emailAddress}
              style={{ height: 48 }}
              onChange={(text) => setEmailAddress(text)}
            />
            <TextInput
              placeholder={'Reason for purchase'}
              name={reasonForPurchase}
              multiline
              style={{ height: 79 }}
              onChange={(text) => setReasonForPurchase(text)}
            />
            <TextInput
              type="number"
              placeholder={'Bid (USD)'}
              style={{ height: 48 }}
              onChange={(text) => setBidUsd(text == '' ? 0 : parseFloat(text))}
            />
            <span className={styles.Bid}>
              {Number((bidUsd * wildToUsd).toFixed(2)).toLocaleString()} WILD
            </span>
          </div>
          <div
            className={`${styles.NFT} border-rounded`}
            // Template NFT for now
            style={{ backgroundImage: `url(assets/nft/redpill.png)` }}
          ></div>
        </div>
      </form>
      <FutureButton
        glow={valid}
        style={{
          height: 36,
          borderRadius: 18,
          textTransform: 'uppercase',
          margin: '47px auto 0 auto',
        }}
        onClick={sendEmail}
      >
        Submit
      </FutureButton>
    </div>
  );
};

export default Enlist;