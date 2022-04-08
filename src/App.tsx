import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { ethers } from 'ethers';
import { Button, Title, Divider } from '@gnosis.pm/safe-react-components'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { SafeAppProvider } from '@gnosis.pm/safe-apps-provider';


const Container = styled.div`
  padding: 1rem;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`
const Link = styled.a`
  margin-top: 8px;
`
const SafeApp = (): React.ReactElement => {
  const { sdk, safe } = useSafeAppsSDK()
  const web3Provider = useMemo(() => new ethers.providers.Web3Provider(new SafeAppProvider(safe, sdk)), [sdk, safe]);

  const submitMessage = useCallback(async () => {
    const signer = web3Provider.getSigner(safe.safeAddress);
    const signedMessage = await signer.signMessage("To the moon?");
    console.log(signedMessage);
  }, [safe, sdk])

  const submitTx = useCallback(async () => {
    const signer = web3Provider.getSigner(safe.safeAddress);
    const pTx = await signer.populateTransaction({
        to: safe.safeAddress,
        value: '0',
        data: '0x',
      });
    console.log(pTx);

    //GS : Error: method not supported eth_gasPrice
    //GS : Error: method not supported eth_getTransactionCount
  }, [safe, sdk])

  const submitTxSdk = useCallback(async () => {
    try {
      const { safeTxHash } = await sdk.txs.send({
        txs: [{
          to: safe.safeAddress,
          value: '0',
          data: '0x',
        }
        ],
      })
      console.log({ safeTxHash })
      const safeTx = await sdk.txs.getBySafeTxHash(safeTxHash)
      console.log({ safeTx })
    } catch (e) {
      console.error(e)
    }
  }, [safe, sdk])

  return (
    <Container>
      <Title size="md">Safe: {safe.safeAddress}</Title>

      <Button size="lg" color="primary" onClick={submitMessage}>
        Click to sign a message.
      </Button>
      <Divider />
      <Button size="lg" color="primary" onClick={submitTx}>
        Click to sign a tx.
      </Button>
      <Divider />
      <Button size="lg" color="primary" onClick={submitTxSdk}>
        Click to sign a tx with safe-sdk.
      </Button>
      <Link href="https://github.com/gnosis/safe-apps-sdk" target="_blank" rel="noreferrer">
        Documentation
      </Link>
    </Container>
  )
}

export default SafeApp
