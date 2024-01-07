// import { ethers } from 'ethers';
// import { useEffect, useState } from 'react';
// import deploy from './deploy';
// import Escrow from './Escrow';

// const provider = new ethers.providers.Web3Provider(window.ethereum);

// export async function approve(escrowContract, signer) {
//   const approveTxn = await escrowContract.connect(signer).approve();
//   await approveTxn.wait();
// }

// function App() {
//   const [escrows, setEscrows] = useState([]);
//   const [account, setAccount] = useState();
//   const [signer, setSigner] = useState();

//   useEffect(() => {
//     async function getAccounts() {
//       const accounts = await provider.send('eth_requestAccounts', []);

//       setAccount(accounts[0]);
//       setSigner(provider.getSigner());
//     }

//     getAccounts();
//   }, [account]);

//   async function newContract() {
//     const beneficiary = document.getElementById('beneficiary').value;
//     const arbiter = document.getElementById('arbiter').value;
//     const value = ethers.BigNumber.from(document.getElementById('wei').value);
//     const escrowContract = await deploy(signer, arbiter, beneficiary, value);

//     const escrow = {
//       address: escrowContract.address,
//       arbiter,
//       beneficiary,
//       value: value.toString(),
//       handleApprove: async () => {
//         escrowContract.on('Approved', () => {
//           document.getElementById(escrowContract.address).className =
//             'complete';
//           document.getElementById(escrowContract.address).innerText =
//             "✓ It's been approved!";
//         });

//         await approve(escrowContract, signer);
//       },
//     };

//     setEscrows([...escrows, escrow]);
//   }

//   return (
//     <>
//       <div className="contract">
//         <h1> New Contract </h1>
//         <label>
//           Arbiter Address
//           <input type="text" id="arbiter" />
//         </label>

//         <label>
//           Beneficiary Address
//           <input type="text" id="beneficiary" />
//         </label>

//         <label>
//           Deposit Amount (in Wei)
//           <input type="text" id="wei" />
//         </label>

//         <div
//           className="button"
//           id="deploy"
//           onClick={(e) => {
//             e.preventDefault();

//             newContract();
//           }}
//         >
//           Deploy
//         </div>
//       </div>

//       <div className="existing-contracts">
//         <h1> Existing Contracts </h1>

//         <div id="container">
//           {escrows.map((escrow) => {
//             return <Escrow key={escrow.address} {...escrow} />;
//           })}
//         </div>
//       </div>
//     </>
//   );
// }

// export default App;

import { ethers } from "ethers";
import { useEffect, useState } from "react";
import deploy from "./deploy";
import EscrowView from "./Escrow";
import Escrow from "./artifacts/contracts/Escrow.sol/Escrow";

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  useEffect(() => {
    async function getEscrows() {
      const factory = new ethers.ContractFactory(
        Escrow.abi,
        Escrow.bytecode,
        signer
      );
      console.log(factory, "contract");
      const contract = await factory.deployed();
      const deployedEscrows = await contract.getAllInstances();
      console.log(deployedEscrows, "deployedEscrows");
      setEscrows(...deployedEscrows);
    }
    getEscrows();
  }, [signer]);

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send("eth_requestAccounts", []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }
    getAccounts();
  }, [account]);

  async function newContract() {
    const beneficiary = document.getElementById("beneficiary").value;
    const arbiter = document.getElementById("arbiter").value;
    const value = document.getElementById("ether").value * 10 ** 18;
    const escrowContract = await deploy(signer, arbiter, beneficiary, value);

    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: value.toString(),
      handleApprove: async () => {
        escrowContract.on("Approved", () => {
          document.getElementById(escrowContract.address).className =
            "complete";
          document.getElementById(escrowContract.address).innerText =
            "✓ It's been approved!";
        });

        await approve(escrowContract, signer);
      },
    };

    setEscrows((escrows) => [...escrows, escrow]);
  }

  return (
    <>
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <input type="text" id="arbiter" />
        </label>

        <label>
          Beneficiary Address
          <input type="text" id="beneficiary" />
        </label>

        <label>
          Deposit Amount (in Ether)
          <input type="text" id="ether" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();

            newContract();
          }}
        >
          Deploy
        </div>
      </div>

      <div className="existing-contracts">
        <h1> Existing Contracts </h1>

        <div id="container">
          {escrows?.map((escrow) => {
            return <EscrowView key={escrow.address} {...escrow} />;
          })}
        </div>
      </div>
    </>
  );
}

export default App;
