import {Link} from 'react-router-dom'
import QuestionContext from '../../context/QuestionsContext'

import './index.css'

const GameResults = () => (
  <QuestionContext.Consumer>
    {value => {
      const {correctlyAttempted, totalQuestions = 10} = value

      const number = (correctlyAttempted / totalQuestions) * 100
      const percentage = parseInt(number)
      return (
        <div className="results-container">
          {percentage >= 60 ? (
            <>
              <img
                src="https://assets.ccbp.in/frontend/react-js/quiz-game-congrats-trophy-img.png"
                alt="won"
                className="results-image"
              />
              <h1>Congrats</h1>
              <h1>{percentage}% Correctly Answered</h1>
              <h1>Quiz completed successfully</h1>
              <p>
                You attempted {correctlyAttempted} out of {totalQuestions}
                questions as correct
              </p>
              <Link to="/game-report">
                <button type="button">Report</button>
              </Link>
            </>
          ) : (
            <>
              <img
                src="https://assets.ccbp.in/frontend/react-js/quiz-game-lose-img.png"
                alt="lose"
                className="results-image"
              />
              <h1>{percentage}% Correctly Answered</h1>
              <h1>You lose</h1>
              <p>
                You attempted {correctlyAttempted} out of {totalQuestions}{' '}
                questions as correct
              </p>
              <Link to="/game-report">
                <button type="button">Report</button>
              </Link>
            </>
          )}
        </div>
      )
    }}
  </QuestionContext.Consumer>
)

export default GameResults
