import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Spacer,
  IconButton,
  Container,
  Circle,
  Image,
  Grid, 
  GridItem,
  CircularProgress,
  ThemeProvider,
  theme,
  ColorModeProvider,
  CSSReset,
  Input,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';

import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';


function App() {

  const config = {
    apiKey: "dJGX1M43RZ8IRxO0gyPjSwKSdj41Vmi8",
    network: Network.ETH_MAINNET,
  };
  
  const alchemy = new Alchemy(config);
  
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const [userAddress, setUserAddress] = useState('');
  const [account, setAccount] = useState();
  const [results, setResults] = useState([]);
  const [hasQueried, setHasQueried] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [tokenDataObjects, setTokenDataObjects] = useState([]);
  const [walletAddress, setWalletAddress] = useState("");
  const [nameid,setName] = useState();

  
  
  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
  }, [walletAddress]);

  const connectWallet = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        /* MetaMask is installed */
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        setUserAddress(accounts[0]);
        console.log(accounts[0]);
        
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  };

  const getCurrentWalletConnected = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setUserAddress(accounts[0]);
          console.log(accounts[0]);
        } else {
          console.log("Connect to MetaMask using the Connect button");
        }
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  };

  const addWalletListener = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        setWalletAddress(accounts[0]);
        setUserAddress(accounts[0]);
        console.log(accounts[0]);
      });
    } else {
      /* MetaMask is not installed */
      setWalletAddress("");
      console.log("Please install MetaMask");
    }
  };

  async function getinfo(x) {
    setUserAddress(x);
    //const name=await provider.lookupAddress(userAddress);
    //const ensContractAddress = "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85";
    
    const getName= await alchemy.core.resolveName(x);
        setName(getName);

    /*
    const nfts = await alchemy.nft.getNftsForOwner(walletAddress, {
      contractAddresses: [ensContractAddress],
    });
    setName[nfts];
    */
  }


  async function getTokenBalance() {
    setisLoading(true);
    /*
    const config = {
      apiKey: 'Se-7teMwhagj9USE3mjDZk5fH2mcJqXs',
      network: Network.ETH_MAINNET,
    };*/

    //const alchemy = new Alchemy(config);
    const data = await alchemy.core.getTokenBalances(userAddress);

    

    setResults(data);

    const tokenDataPromises = [];

    for (let i = 0; i < data.tokenBalances.length; i++) {
      const tokenData = alchemy.core.getTokenMetadata(
        data.tokenBalances[i].contractAddress
      );
      tokenDataPromises.push(tokenData);
    }

    setTokenDataObjects(await Promise.all(tokenDataPromises));
    setHasQueried(true);
    setisLoading(false);
  }

  return (
      <Box w="100vw" textAlign="right" py={4} mr={12}>
      <Center>
        <Flex
          alignItems={'center'}
          justifyContent="center"
          flexDirection={'column'}
        >
          <Heading mb={0} fontSize={36}>
            ERC-20 Token Indexer
          </Heading>
          <Text>
            Plug in an address and this website will return all of its ERC-20
            token balances!
          </Text>
        </Flex>
      </Center>
      <Flex
        w="100%"
        flexDirection="column"
        alignItems="center"
        justifyContent={'center'}
      >
        <Heading mt={42}>
          Get all the ERC-20 token balances of this address:
        </Heading>
        <Text mb='8px'>Value: {nameid}</Text>
        <Input
          value={userAddress}
          onChange={(e) => {getinfo(e.target.value)}}
          color="black"
          w="600px"
          textAlign="center"
          p={4}
          bgColor="white"
          fontSize={24} />
        <Button fontSize={20} size='sm'
          onClick={connectWallet} mt={36} bgColor="blue">
          {walletAddress && walletAddress.length > 0
            ? `Connected: ${walletAddress.substring(
              0,
              6
            )}...${walletAddress.substring(38)}`
            : "Connect Wallet"}
        </Button>

        <Button fontSize={20} onClick={getTokenBalance} mt={24} bgColor="blue">
          {isLoading ? (
          <CircularProgress isIndeterminate size="24px" color="teal" />
          ) : (
            'Check ERC-20 Token Balances')}
        </Button>

        <Heading my={36}>ERC-20 token balances:</Heading>

        {hasQueried ? (
          <SimpleGrid w={'90vw'} columns={4} spacing={24}>
            {results.tokenBalances.map((e, i) => {
              return (
                <Flex
                  flexDir={'column'}
                  color="white"
                  //backgroundColor='blue'
                  w={'20vw'}
                  key={e.id}
                >
                  <Grid
                  h='150px'
                  templateRows='repeat(4, 1fr)'
                  //templateColumns='repeat(1, 1fr)'
                  gap={2}
                >
                  <Center><GridItem  rowSpan={1}><Center>{tokenDataObjects[i].symbol.substring(0,15)}</Center></GridItem></Center>
                  <GridItem rowSpan={2}>
                    <Center><Image borderRadius='full' boxSize='70px' 
                  src={tokenDataObjects[i].logo} fallbackSrc='https://via.placeholder.com/150/00000/FFFFFF?text=No+image'/></Center></GridItem>
                  <GridItem  overflow='hidden' rowSpan={1}><Center>{(Utils.formatUnits(
                      e.tokenBalance,
                      tokenDataObjects[i].decimals).toString().substring(0,15)
                    )}</Center>
                    </GridItem>
                  </Grid>
                </Flex>
              );
            })}
          </SimpleGrid>
        ) : (
          'Please make a query! This may take a few seconds...'
        )}
      </Flex>
    </Box>
  );
}

export default App;
