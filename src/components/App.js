import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import EVMContract from '../abis/EVMContract.json'
class App extends Component {


  state = {
    account: null,
    ecoEarnerContract: null,
    candidateAddresses:[],
    candidateData: [],
    winner:{name:null,address:null}
  }


  constructor(props) {
    super(props);
  }

 
  async loadWeb3() {
   try{ if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      console.log(window);
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      console.log(window);
    }
    else {
      window.alert('Metamask is not installed.');
    }}
    catch(error){
      console.log("error in loadWeb3",error);
    

    }

  }
  async componentDidMount() {
  await this.refreshAll();
  }
async refreshAll(){
    await this.loadWeb3();
    await this.loadAccountInformation(); 
    await this.getCandidateAddresses();
    await this.getCandidateData();
    console.log('d',this.state.candidateData);
}




  async loadAccountInformation() {
    try {const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const networkId = await web3.eth.net.getId();
    const networkData = EVMContract.networks[networkId];
    if (networkData) {
      const evmContract = new web3.eth.Contract(EVMContract.abi, networkData.address)
      console.log(evmContract);

      this.setState({ evmContract })
    } else {
      alert("Sorry you are on wrong network");
    }}
    catch(error){
      console.log("error in loadAccountInformation",error);
    }
  }

  //get the candidate addresses from blockchain 

  getCandidateAddresses = async() => {
    const candidateAddresses = await this.state.evmContract.methods.getCandidateList().call();
    console.log("candidate list",candidateAddresses);
    this.setState({candidateAddresses:candidateAddresses || []})
  }

  getCandidateData = async() => {
    this.setState({
       candidateData:[] 
    });
    for(const address of this.state.candidateAddresses){
      console.log('address',address);
      const data = await this.state.evmContract.methods.getCandidateData(address).call();
      console.log('data',data.voteCount);
      const candidateData = {
        name: data.name,
        voteCount: data.voteCount.toString(),
        ethAddress: address
       } 
      
      this.setState({
        candidateData :[...this.state.candidateData,candidateData]
      });
    }
    
  }
  
  // function will be called when candidate click on vote button
  handleVote = async (event,candidateEthAddress) => {
    event.preventDefault();
    console.log("Voting to candidate",candidateEthAddress);
    const data = await this.state.evmContract.methods.vote(candidateEthAddress).send({from: this.state.account});
    console.log("voting is done",data);
    this.refreshAll();
  };

  handleSubmit =  async (event) => {
    event.preventDefault();
    let new_candidate = {
      name: event.currentTarget.elements.candidate.value,
      votes: 0
    };
    // call the blockchain method here to add candidate in contract
    console.log('calling blockchain')
    const r = await this.state.evmContract.methods.register(new_candidate.name).send({ from: this.state.account})
    console.log('Registered Candidate.',r);
    this.refreshAll();
  };
  declareWinner = async () =>{
    const winner = await this.state.evmContract.methods.winner().call();
    console.log('winner',winner);
    this.setState({
    winner:winner,
    })
  }
  getCandidates = () => {
    return this.state.candidateData && this.state.candidateData.map(candidate => (
      <div className="candidateBlock">
        <span className="name">{candidate.name}</span>
        <br />
        <span className="votes">Votes:{candidate.voteCount}</span>

        <br />
        <span className="address">Address:{candidate.ethAddress}</span>
        <br />
        <button
          type="button"
          onClick={(e) => {
            this.handleVote(e,candidate.ethAddress);
          }}
        >
          Vote
        </button>
      </div>
    ));
  };

  
  

  
  render() {
    return (
      <div className="App">
        <div id="header">
          <span id="address">Address: {this.state.account}</span>
        </div>
        <div>
          Winner of Election: {this.state.winner.name || 'Not declared yet'}
        </div>
        <div className="main">
          <div className="adminD">
            <div id="candF">
              <form onSubmit={this.handleSubmit}>
                <label for="candidate">Candidate Name </label>
                <input
                  type="text"
                  name="candidate"
                  placeholder="Enter candidate name"
                  required
                />
                <br />
                <br />
                <button type="submit">Add Candidate</button>
              </form>
            </div>
            <div id="results">
              <button type="button"   onClick={(e) => {
            this.declareWinner();
          }}>Close and declare results</button>
            </div>
          </div>
          <div className="voterD">{this.getCandidates()}</div>
        </div>
      </div>
    );
  }
}

export default App;
