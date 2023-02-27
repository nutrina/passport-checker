import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { ethers } from "ethers";
import { Tulons } from "tulons";
import axios from "axios";

type StampRef = {
  provider: string;
  credential: string;
};

type CeramicResponse = {
  state: { content: any };
};

type Stamp = {
  type: string[];
  proof: {
    jws: string;
    type: string;
    created: string;
    proofPurpose: string;
    verificationMethod: string;
  };
  issuer: string;
  "@context": string[];
  issuanceDate: string;
  expirationDate: string;
  credentialSubject: {
    id: string;
    hash: string;
    "@context": [
      {
        hash: string;
        provider: string;
      }
    ];
    provider: string;
  };
};

function App() {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
  const [addressToVerify, setAddressToVerify] = useState<string>();
  const [stampDetails, setStampDetails] = useState<
    PromiseSettledResult<Stamp>[]
  >([]);

  useEffect(() => {
    // A Web3Provider wraps a standard Web3 provider, which is
    // what MetaMask injects as window.ethereum into each page
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
  }, []);

  const handleConnect = async () => {
    if (provider) {
      // A Web3Provider wraps a standard Web3 provider, which is
      // what MetaMask injects as window.ethereum into each page
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // MetaMask requires requesting permission to connect users accounts
      const accounts = await provider.send("eth_requestAccounts", []);

      // const account = accounts[0];
      const account = "0xa6C11f4DeFFC6b06D0bB7A64244cB9E59a7D6718";

      const tulons = new Tulons("https://ceramic.passport-iam.gitcoin.co", "1");

      const { streams } = await tulons.getGenesis(account);

      console.log("streams", streams);

      // const CERAMIC_GITCOIN_PASSPORT_STREAM_ID =
      //   "kjzl6cwe1jw14adnyrryrgbiqe8vka2lqly55zc219euskbsiyz3xsq0zkjifea";
      const CERAMIC_GITCOIN_PASSPORT_STREAM_ID =
        "kjzl6cwe1jw148h1e14jb5fkf55xmqhmyorp29r9cq356c7ou74ulowf8czjlzs";

      // kjzl6cwe1jw14adnyrryrgbiqe8vka2lqly55zc219euskbsiyz3xsq0zkjifea
      // kjzl6cwe1jw148h1e14jb5fkf55xmqhmyorp29r9cq356c7ou74ulowf8czjlzs

      if (streams[CERAMIC_GITCOIN_PASSPORT_STREAM_ID]) {
        // Get Passport data and hydrate the Record to get access to raw stamp data
        console.log(
          "CERAMIC_GITCOIN_PASSPORT_STREAM_ID",
          CERAMIC_GITCOIN_PASSPORT_STREAM_ID
        );
        console.log(
          "CERAMIC_GITCOIN_PASSPORT_STREAM_ID",
          streams[CERAMIC_GITCOIN_PASSPORT_STREAM_ID]
        );

        const passportResponse = (await axios.get(
          `https://ceramic.passport-iam.gitcoin.co/api/v0/streams/${streams[
            CERAMIC_GITCOIN_PASSPORT_STREAM_ID
          ].slice(10)}`
        )) as { data: { state: { content: { stamps: StampRef[] } } } };

        const passport = passportResponse.data;

        //ceramic.passport-iam.gitcoin.co/api/v0/streams/k2t6wyfsu4pg0gtnfojgu0stgckjvelau1dod0na0lc5x7qqcdrcyrdlyihla1

        // https: const passport = await tulons.getHydrated(
        //   await tulons.getStream(streams[CERAMIC_GITCOIN_PASSPORT_STREAM_ID])
        // );

        console.log("passport", passport);
        console.log("passport", passport.state);
        console.log("passport", passport.state.content);
        const stampsRefs = passport.state.content.stamps;
        console.log("stamps", stampsRefs);

        const stamps: PromiseSettledResult<Stamp>[] = await Promise.allSettled(
          stampsRefs.map(async (ceramicLink: StampRef) => {
            console.log("ceramicLink", ceramicLink);
            const stampRequests = await axios.get(
              `https://ceramic.passport-iam.gitcoin.co/api/v0/streams/${ceramicLink.credential.slice(
                10
              )}`
            );
            console.log("Stamp:", stampRequests.data);
            const ceramicResponse = stampRequests.data as CeramicResponse;
            const stamp = ceramicResponse.state.content as Stamp;
            return stamp;
          })
        );

        console.log("stamps", stamps);
      }
    }
  };

  const handleVerify = async () => {
    const tulons = new Tulons("https://ceramic.passport-iam.gitcoin.co", "1");

    if (addressToVerify) {
      const { streams } = await tulons.getGenesis(addressToVerify);

      console.log("streams", streams);

      // const CERAMIC_GITCOIN_PASSPORT_STREAM_ID =
      //   "kjzl6cwe1jw14adnyrryrgbiqe8vka2lqly55zc219euskbsiyz3xsq0zkjifea";
      const CERAMIC_GITCOIN_PASSPORT_STREAM_ID =
        "kjzl6cwe1jw148h1e14jb5fkf55xmqhmyorp29r9cq356c7ou74ulowf8czjlzs";

      // kjzl6cwe1jw14adnyrryrgbiqe8vka2lqly55zc219euskbsiyz3xsq0zkjifea
      // kjzl6cwe1jw148h1e14jb5fkf55xmqhmyorp29r9cq356c7ou74ulowf8czjlzs

      if (streams[CERAMIC_GITCOIN_PASSPORT_STREAM_ID]) {
        // Get Passport data and hydrate the Record to get access to raw stamp data
        console.log(
          "CERAMIC_GITCOIN_PASSPORT_STREAM_ID",
          CERAMIC_GITCOIN_PASSPORT_STREAM_ID
        );
        console.log(
          "CERAMIC_GITCOIN_PASSPORT_STREAM_ID",
          streams[CERAMIC_GITCOIN_PASSPORT_STREAM_ID]
        );

        const passportResponse = (await axios.get(
          `https://ceramic.passport-iam.gitcoin.co/api/v0/streams/${streams[
            CERAMIC_GITCOIN_PASSPORT_STREAM_ID
          ].slice(10)}`
        )) as { data: { state: { content: { stamps: StampRef[] } } } };

        const passport = passportResponse.data;

        //ceramic.passport-iam.gitcoin.co/api/v0/streams/k2t6wyfsu4pg0gtnfojgu0stgckjvelau1dod0na0lc5x7qqcdrcyrdlyihla1

        // https: const passport = await tulons.getHydrated(
        //   await tulons.getStream(streams[CERAMIC_GITCOIN_PASSPORT_STREAM_ID])
        // );

        console.log("passport", passport);
        console.log("passport", passport.state);
        console.log("passport", passport.state.content);
        const stampsRefs = passport.state.content.stamps;
        console.log("stamps", stampsRefs);

        const stamps: PromiseSettledResult<Stamp>[] = await Promise.allSettled(
          stampsRefs.map(async (ceramicLink: StampRef) => {
            console.log("ceramicLink", ceramicLink);
            const stampRequests = await axios.get(
              `https://ceramic.passport-iam.gitcoin.co/api/v0/streams/${ceramicLink.credential.slice(
                10
              )}`
            );
            console.log("Stamp:", stampRequests.data);
            const ceramicResponse = stampRequests.data as CeramicResponse;
            const stamp = ceramicResponse.state.content as Stamp;
            return stamp;
          })
        );

        console.log("stamps", stamps);
        setStampDetails(stamps)
      }
    }
  };

  const stampDetailsComponent = stampDetails.map(
    (fulfillDetails: PromiseSettledResult<Stamp>, index: number) => {
      const fullfilled = fulfillDetails as PromiseFulfilledResult<Stamp>;
      const rejected = fulfillDetails as PromiseRejectedResult;

      if (fulfillDetails.status === "fulfilled") {
        return (
          <div key={index}>
            <h5>{fullfilled.value.credentialSubject.provider}</h5>
            <div>{fullfilled.value.credentialSubject.provider} - {fullfilled.value.issuanceDate} - {fullfilled.value.expirationDate}</div>
            {/* <div>Status: {JSON.stringify(fullfilled.value, undefined, 2)}</div> */}
          </div>
        );
      } else {
        return (
          <div key={index}>
            <h5>{index} - ???</h5>
            <div>{rejected.status} - {rejected.reason.message}</div>
            <code>Status: {JSON.stringify(rejected.reason.response.data, null, 2)}</code>
          </div>
        );
      }
    }
  );

  return (
    <div className="App">
      <header className="App-header">
        <p>Check your Passport</p>
        <input
          value={addressToVerify}
          onChange={(e) => setAddressToVerify(e.target.value)}
        ></input>
        <button onClick={handleVerify}>Verify</button>
        {/* <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Check your Passport
        </a>
        <button onClick={handleConnect}>Connect</button> */}
      </header>
      <h1>Stamps</h1>
      <h5>Number of stamps: {stampDetailsComponent.length} </h5>
      {stampDetailsComponent}
    </div>
  );
}

export default App;
