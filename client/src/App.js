import React, {useState, useEffect} from 'react';
import  {ethers} from 'ethers';
import 'bootstrap/dist/css/bootstrap.css';

// const ethers = require("ethers")

function App() {
  const [depostValue, setDepostValue] = useState(0);
  const [greeterValue, setGreeterValue]= useState('Mohammad');
  const [balance, setBalance ] =useState();
  const [greete, setGreet] = useState("Hi Web3");

  const depostChange= (e) => {
    setDepostValue(e.target.value);
  }
  const greetingChange= (e) => {
    setGreeterValue(e.target.value);
  }

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const accountAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";


const ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_greeting",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "greet",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_greeting",
        "type": "string"
      }
    ],
    "name": "setGreeting",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// The Contract object
const contract = new ethers.Contract(accountAddress, ABI, signer);

useEffect(() => {
  const connectWalet= async() => {
    await provider.send("eth_requestAccounts", []);
  }
  const getBalance = async()=> {
    const balance= await provider.getBalance(accountAddress);
    const formatBalance = ethers.utils.formatEther(balance); 
    setBalance(formatBalance);
  }

  const getGreeter= async() => {
    const getCont = await contract.greet();
    setGreet(getCont);
  }


  connectWalet().catch(console.error);
  getBalance().catch(console.error);
  getGreeter().catch(console.error);
}, [])



const depositHandler= async(e) => {
  e.preventDefault();
  console.log(depostValue);
  const getBalanceValue= ethers.utils.parseEther(depostValue);
  const putbalance= await contract.deposit({ value: getBalanceValue});
  await putbalance.wait();

  const balance= await provider.getBalance(accountAddress);
  const formatBalance = ethers.utils.formatEther(balance); 
  setBalance(formatBalance);
  // depostChange(0);

}

const greetingHandler = async(e) => {
  e.preventDefault();
  // console.log(greeterValue);
  const setGreetUpdate= await contract.setGreeting(greeterValue);
  await setGreetUpdate.wait();
  setGreet(greeterValue);
  // greetingChange('');
}



  return (
    <div className="App">
      <div className="container">
        <div className="row mt-5">
          <div className="col">
            <h2>{greete}</h2>
            <p>Balance Account: {balance} ETH</p>
          </div>
          <div className="col">
              <form onSubmit={depositHandler}>
                <div className="mb-3">
                  <input type="number" className="form-control" onChange={depostChange} value={depostValue} />
                </div>              
                <button type="submit" className="btn btn-primary">Deposit</button>
              </form><br />

              <form onSubmit={greetingHandler}>
                <div className="mb-3">
                  <input type="text" className="form-control" onChange={greetingChange} value={greeterValue}/>
                </div>              
                <button type="submit" className="btn btn-dark">Submit</button>
              </form>
          </div>
        
        </div>
      </div>
    </div>
  );
}

export default App;
