import React, { Component } from "react";
import './App.css'
class App1 extends Component {
  constructor(props) {
      super(props)
    this.state = {
      data: _data
    }; 
  }

  address = "0x1829EF922942198C25cC1013981033Cd70DFA8a1";

  handleVote = (name, votes) => {
    let new_data = this.state.data.map(candidate => {
      if (candidate.name === name) {
        candidate.votes += 1;
      }
      return candidate;
    });
    this.setState({ data: new_data });
  };

  handleSubmit = event => {
    event.preventDefault();
    let new_candidate = {
      name: event.currentTarget.elements.candidate.value,
      votes: 0
    };
    this.setState({data:[...this.state.data,new_candidate]})
  };

  getCandidates = () => {
    return this.state.data.map(candidate => (
      <div className="candidateBlock">
        <span className="name">{candidate.name}</span>
        <br />
        <span className="votes">Votes:{candidate.votes}</span>
        <br />
        <br />
        <button
          type="button"
          onClick={() => {
            this.handleVote(candidate.name, candidate.votes);
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
          <span id="address">Address: {this.address}</span>
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
              <button type="button">Close and declare results</button>
            </div>
          </div>
          <div className="voterD">{this.getCandidates()}</div>
        </div>
      </div>
    );
  }
}

let _data = [
  {
    name: "Neeraj",
    votes: 0
  },
  {
    name: "Shivam",
    votes: 0
  },
  {
    name: "Sidharth",
    votes: 0
  },
  {
    name: "Ravi verma",
    votes: 0
  },
  {
    name: "Sahil",
    votes: 0
  },
  {
    name: "Akshay",
    votes: 0
  }
];

export default App1;
