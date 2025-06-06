import React, { useState, useEffect } from 'react';
import './App.css';

// Array of emojis for the cards (4 pairs for 3x3 grid with one empty space)
const cardEmojis = ['🐶', '🐱', '🐭', '🐹'];

function App() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);

  // Initialize the game
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // Create pairs of cards and add one empty tile
    const emojis = [...cardEmojis, ...cardEmojis, null];
    // Shuffle the cards
    const shuffled = emojis
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        flipped: false,
        solved: false,
      }));

    setCards(shuffled);
    setFlipped([]);
    setSolved([]);
  };

  const handleCardClick = (id) => {
    const clickedCard = cards.find(card => card.id === id);
    // Don't allow clicking if already flipped, disabled, or if it's the empty tile
    if (flipped.length === 2 || disabled || flipped.includes(id) || solved.includes(id) || !clickedCard.emoji) {
      return;
    }

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    // Update the flipped state of the clicked card
    const newCards = cards.map((card) =>
      card.id === id ? { ...card, flipped: true } : card
    );
    setCards(newCards);

    // Check for a match if two cards are flipped
    if (newFlipped.length === 2) {
      setDisabled(true);
      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find((card) => card.id === firstId);
      const secondCard = cards.find((card) => card.id === secondId);

      if (firstCard.emoji === secondCard.emoji) {
        // Match found
        setSolved([...solved, firstId, secondId]);
        setFlipped([]);
        setDisabled(false);
      } else {
        // No match, flip cards back after a delay
        setTimeout(() => {
          const resetCards = cards.map((card) =>
            newFlipped.includes(card.id) ? { ...card, flipped: false } : card
          );
          setCards(resetCards);
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  // Check for win condition (8 cards solved in 3x3 grid)
  useEffect(() => {
    if (solved.length === 8) {  // 4 pairs * 2 cards each = 8 cards
      setTimeout(() => {
        alert('Congratulations! You won!');
        initializeGame();
      }, 500);
    }
  }, [solved, cards.length]);

  return (
    <div className="App">
      <h1>Amit's Game-verse Memory Card Game</h1>
      <button className="reset-button" onClick={initializeGame}>
        New Game
      </button>
      <div className="card-grid">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`card ${!card.emoji ? 'empty' : ''} ${
              card.flipped || card.solved ? 'flipped' : ''
            } ${card.solved ? 'solved' : ''}`}
            onClick={() => handleCardClick(card.id)}
          >
            {card.emoji !== null ? (
              <div className="card-inner">
                <div className="card-front">?</div>
                <div className="card-back">{card.emoji}</div>
              </div>
            ) : (
              <div className="empty-tile"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;