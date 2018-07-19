import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


class Square extends React.Component {
  render() {
    let self = this;
    return (
      <button 
        className="square" 
        onClick={this.props.onClick}
      >
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare (i) {
    return (
      <Square
        value = {this.props.squares[i]}
        onClick = {() => this.props.onClick(i)}
      />
    );
  }
  render() {
    const status = this.props.winner ?
      '' + this.props.winner + ' won!' :
      'Next player: ' + this.props.nextPlayer;
    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        nextPlayer: 'X',
        winner: null,
      }],
    }
  }
  calculateWinner (squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = lines.length; i --> 0; ) {
      const [a, b, c] = lines[i];
      if (squares[a] 
        && squares[a] === squares[b]
        && squares[a] == squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  handleClick (i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    if (current.winner || current.squares[i]) {
      return;
    }
    const squares = current.squares.slice();
    squares[i] = current.nextPlayer;
    const nextPlayer = current.nextPlayer == 'X' ? 'O' : 'X';
    const winner = this.calculateWinner(squares);

    this.setState({
      history: history.concat([{
        squares: squares,
        nextPlayer: nextPlayer,
        winner: winner,
      }])
    });
  }
  jumpTo (i) {
    if (i < 0) {
      return;
    }
    const history = this.state.history;
    this.setState({
      history: history.slice(0, i + 1)
    });
  }
  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + (move + 1) :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() =>
            this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            nextPlayer={current.nextPlayer}
            winner={current.winner}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
