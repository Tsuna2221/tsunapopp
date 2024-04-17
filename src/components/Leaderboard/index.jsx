import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext';

import { Leaderboard as Container, LeaderboardWrapper, List, User, Name, Points } from "./styles"


const Leaderboard = () => {
  const { quiz, connect } = useContext(QuizContext)
  const items = quiz?.quizItems || []
  const names = items.map(({ guessedBy }) => guessedBy).filter(x => x)

  const count = names.reduce((value, value2) => {
    return (
      value[value2] ? ++value[value2] :(value[value2] = 1),
      value
    );
  }, {});

  const filteredCount = Object.keys(count).sort((a, b) => count[b] - count[a])

  return (
    <Container active={connect && filteredCount.length}>
      <LeaderboardWrapper>
        <List>
          {
            filteredCount.map(name => (
              <User key={name}>
                <Name style={{ fontWeight: name === "Você" ? "500" : "normal", textDecoration: name === "Você" ? "underline" : "none" }}>{name}</Name>
                <Points>{count[name]}</Points>
              </User>
            ))
          }
        </List>
      </LeaderboardWrapper>
    </Container>
  )
}
export default Leaderboard