import { FC } from 'react';
import { useDomainCache } from '../../../lib/useDomainCache';

interface TableImageGlobalProps {
  domain: string;
}

const TableImageGlobal: FC<TableImageGlobalProps> = ({ domain: _domain }) => {
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain } = domainContext;
  if (domain.isNothing()) return null;

  return (
    <>
      {/* TODO: check if there is no image file */}
      {domain.isJust() && (
        <div className="domainImageGlobalContainer">
          <img
            className="domainImageGlobal"
            src={domain.value.image.replace('ipfs://', 'https://ipfs.io/ipfs/')}
            alt=""
          />
        </div>
      )}
      {/*console.log(domain.value.image, domain.value.domain)*/}
    </>
  );
};
export default TableImageGlobal;
