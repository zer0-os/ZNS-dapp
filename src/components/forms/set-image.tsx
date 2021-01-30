import React, { FC, useState, useCallback } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useZnsContracts } from '../../lib/contracts';
import { useDomainCache } from '../../lib/useDomainCache';
import { useDomainStore } from '../../lib/useDomainStore';
import { Modal, Button } from 'antd';
import Create from '../create';
import { zodResolver } from '../../lib/validation/zodResolver';
import ipfs from '../../lib/ipfs';
interface SetImageProps {
  domain: string;
}

const schema = z
  .object({
    image: z
      .any()
      .transform(z.any(), (files: FileList) => files[0])
      .optional(),
    url: z.string().url().optional(),
  })
  .refine((obj) => 'url' in obj || (obj.image && obj.image.size > 0));

const SetImage: FC<SetImageProps> = ({ domain: _domain }) => {
  const [isSetImageVisible, setSetImageVisible] = useState(false);
  const context = useWeb3React<Web3Provider>();
  const contracts = useZnsContracts();
  const { library, account, active, chainId } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain, refetchDomain } = domainContext;
  const [done, setDone] = useState(false);
  const { register, handleSubmit, errors } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const _setImage = useCallback(
    (imageUrl: string) => {
      if (
        account &&
        contracts.isJust() &&
        domain.isJust() &&
        account === domain.value.owner
      )
        contracts.value.registry
          .setImage(domain.value.id, imageUrl)
          .then((txr: any) => txr.wait(1))
          .then(() => {
            refetchDomain();
          });
    },
    [contracts, account, domain],
  );

  const uploadAndSetImage = useCallback(
    (file: File) =>
      ipfs
        .add(file)
        .then((added) => _setImage('ipfs://' + added.cid.toV0().toString()))
        .then(() => refetchDomain()),
    [_setImage],
  );

  if (domain.isNothing()) return <p>Loading</p>;

  console.log(
    'domain image',
    domain.value.image.replace('ipfs://', 'https://ipfs.io/ipfs/'),
  );
  const hideSetImage = () => {
    setSetImageVisible(false);
  };

  const showSetImage = () => {
    setSetImageVisible(true);
  };

  return (
    <>
      <button
        className="btn-sub"
        style={{ color: 'white' }}
        onClick={showSetImage}
      >
        Set image
      </button>

      <Modal
        title="subdomain"
        visible={isSetImageVisible}
        // onOk={profileOk}
        onCancel={hideSetImage}
      >
        {domain.isJust() && (
          <>
            <img
              style={{ height: '10%', width: '10%' }}
              src={domain.value.image.replace(
                'ipfs://',
                'https://ipfs.io/ipfs/',
              )}
            />
            <form
              onSubmit={handleSubmit(({ image, url }) =>
                url ? _setImage(url) : uploadAndSetImage(image),
              )}
            >
              <div className="create-button">
                <button type="submit">Set domain image</button>
                <input name={'image'} type="file" ref={register} />
              </div>
            </form>
          </>
        )}
      </Modal>
    </>
  );
};
export default SetImage;
