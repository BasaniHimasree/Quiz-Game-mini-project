import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import Loader from 'react-loader-spinner'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class QuizGameRoute extends Component {
  state = {
    questions: [],
    currentQuestionIndex: 0,
    selectedOption: null,
    correctOption: null,
    showFeedback: false,
    timer: 15,
    isNextEnabled: false,
    correctlyAttempted: 0,
    unAttemptedQuestions: 0,
    wrongAnswers: 0,
    totalQuestions: 10,
    reports: [],
  }

  componentDidMount() {
    this.fetchQuestions()
    this.intervalId = setInterval(this.decrementTimer, 1000)
  }

  componentWillUnmount() {
    this.clearTimerInterval()
  }

  clearTimerInterval = () => clearInterval(this.intervalId)

  fetchQuestions = async () => {
    const token = Cookies.get('jwt_token')
    if (token === undefined) {
      ;<Redirect to="/login" />
      return
    }

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = 'https://apis.ccbp.in/assess/questions'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    try {
      if (response.ok === true) {
        const data = await response.json()

        this.setState({
          questions: data.questions,
          apiStatus: apiStatusConstants.success,
          totalQuestions: data.total,
        })
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch (error) {
      console.error('Error fetching quiz game data:', error)
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  decrementTimer = () => {
    const {
      timer,
      selectedOption,

      questions,
      currentQuestionIndex,
    } = this.state
    if (timer > 0) {
      this.setState(prevState => ({timer: prevState.timer - 1}))
    } else {
      if (!selectedOption) {
        const unAttemptedQuestion = questions[currentQuestionIndex]
        this.setState(prevState => ({
          reports: [...prevState.reports, unAttemptedQuestion],
          unAttemptedQuestions: prevState.unAttemptedQuestions + 1,
        }))
      }
      this.handleNextQuestion(true)
    }
  }

  handleOptionSelect = optionId => {
    const {currentQuestionIndex, questions, timer} = this.state
    const correctOption = questions[currentQuestionIndex].options.find(
      opt => opt.is_correct === 'true',
    )
    const isCorrect = optionId === correctOption.id
    this.clearTimerInterval()
    this.setState(
      prevState => {
        // Default to 0 if somehow undefined
        const updatedUnAttemptedQuestions =
          timer <= 0
            ? prevState.unAttemptedQuestions + 1
            : prevState.unAttemptedQuestions

        const updatedCorrectAnswers = isCorrect
          ? prevState.correctlyAttempted + 1
          : prevState.correctlyAttempted

        const updatedWrongAnswers = !isCorrect
          ? prevState.wrongAnswers + 1
          : prevState.wrongAnswers

        return {
          selectedOption: optionId,
          correctOption: correctOption.id,
          isNextEnabled: true,
          showFeedback: true,

          correctlyAttempted: updatedCorrectAnswers,
          unAttemptedQuestions: updatedUnAttemptedQuestions,
          wrongAnswers: updatedWrongAnswers,
        }
      },

      () => {
        // Force update context by calling render
        this.forceUpdate()
      },
    )
  }

  handleNextQuestion = () => {
    const {
      currentQuestionIndex,
      questions,
      correctlyAttempted,
      totalQuestions,
      wrongAnswers,
      unAttemptedQuestions,
      reports,
    } = this.state

    if (currentQuestionIndex + 1 < questions.length) {
      // If user skips or doesn't select an option, add to reports

      this.setState(
        prevState => ({
          currentQuestionIndex: prevState.currentQuestionIndex + 1,
          timer: 15,
          selectedOption: null,
          isNextEnabled: false,
        }),
        () => {
          this.intervalId = setInterval(this.decrementTimer, 1000)
        },
      )
    } else {
      const {history} = this.props
      this.setState(
        prevState => ({
          correctlyAttempted: prevState.correctlyAttempted,
          totalQuestions: prevState.totalQuestions,
          wrongAnswers: prevState.wrongAnswers,

          reports: prevState.reports,
        }),
        () => {
          localStorage.setItem(
            'quizResults',
            JSON.stringify({
              correctlyAttempted,
              totalQuestions,
              wrongAnswers,
              unAttemptedQuestions,
              reports,
            }),
          )

          history.push('/game-results', {
            correctlyAttempted,
            totalQuestions,
            unAttemptedQuestions,
            wrongAnswers,
            reports,
          })
        },
      )
    }
  }

  renderQuestionOptions = question => {
    const {selectedOption, correctOption, showFeedback} = this.state

    return (
      <ul className="options-list">
        {question.options.map(option => {
          const isSelected = selectedOption === option.id
          const isCorrect = correctOption === option.id

          let optionClass = ''
          if (showFeedback) {
            if (isSelected && isCorrect) {
              optionClass = 'correct-option' // Green for correct selection
            } else if (isSelected && !isCorrect) {
              optionClass = 'wrong-option' // Red for incorrect selection
            } else if (isCorrect) {
              optionClass = 'correct-option' // Green for correct answer
            }
          }

          return (
            <li key={option.id} className={`each-option ${optionClass}`}>
              {/* DEFAULT OPTION TYPE */}
              {question.options_type === 'DEFAULT' && (
                <div className="image-option-container">
                  <button
                    type="button"
                    className="onclick-button"
                    onClick={() =>
                      !selectedOption && this.handleOptionSelect(option.id)
                    }
                    disabled={selectedOption !== null}
                  >
                    {option.text}
                  </button>{' '}
                  {showFeedback && (
                    <>
                      {isSelected && !isCorrect && (
                        <img
                          src="https://assets.ccbp.in/frontend/react-js/quiz-game-close-circle-img.png"
                          alt="incorrect close circle"
                          className="feedback-icon"
                        />
                      )}
                      {isCorrect && (
                        <img
                          src="https://assets.ccbp.in/frontend/react-js/quiz-game-check-circle-img.png"
                          alt="correct checked circle"
                          className="feedback-icon"
                        />
                      )}
                    </>
                  )}
                </div>
              )}

              {/* IMAGE OPTION TYPE */}
              {question.options_type === 'IMAGE' && (
                <div className="image-option-container">
                  <img
                    src={option.image_url}
                    alt={option.text}
                    className="image-button"
                    onClick={() =>
                      !selectedOption && this.handleOptionSelect(option.id)
                    }
                    disabled={selectedOption !== null}
                  />
                  {showFeedback && (
                    <>
                      {isSelected && !isCorrect && (
                        <img
                          src="https://assets.ccbp.in/frontend/react-js/quiz-game-close-circle-img.png"
                          alt="incorrect close circle"
                          className="feedback-icon"
                        />
                      )}
                      {isCorrect && (
                        <img
                          src="https://assets.ccbp.in/frontend/react-js/quiz-game-check-circle-img.png"
                          alt="correct checked circle"
                          className="feedback-icon"
                        />
                      )}
                    </>
                  )}
                </div>
              )}

              {/* SINGLE SELECT OPTION TYPE */}
              {question.options_type === 'SINGLE_SELECT' && (
                <div className="single-select-container">
                  <input
                    type="radio"
                    id={option.id}
                    name="quiz-option"
                    className="option-radio"
                    onClick={() =>
                      !selectedOption && this.handleOptionSelect(option.id)
                    }
                    disabled={selectedOption !== null}
                  />
                  <label htmlFor={option.id} className="radio-label">
                    {option.text}
                  </label>
                  {showFeedback && (
                    <>
                      {isSelected && !isCorrect && (
                        <img
                          src="https://assets.ccbp.in/frontend/react-js/quiz-game-close-circle-img.png"
                          alt="incorrect close circle"
                          className="feedback-icon"
                        />
                      )}
                      {isCorrect && (
                        <img
                          src="https://assets.ccbp.in/frontend/react-js/quiz-game-check-circle-img.png"
                          alt="correct checked circle"
                          className="feedback-icon"
                        />
                      )}
                    </>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    )
  }

  onClickButton = () => {
    this.fetchQuestions()
  }

  renderFailureView = () => (
    <div className="quizgame-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-assess-failure-img.png"
        alt="failure view"
        className="failure-view-image"
      />
      <h1>Something went wrong</h1>
      <p>Our servers are busy please try again</p>

      <button type="button" onClick={this.onClickButton}>
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#263868" height={50} width={50} />
    </div>
  )

  renderQuestionsData = () => {
    const {
      questions,
      currentQuestionIndex,
      timer,
      isNextEnabled,
      totalQuestions,
    } = this.state

    const buttonStyle = !isNextEnabled ? 'onclick-button' : 'button-style'

    const currentQuestion = questions[currentQuestionIndex]

    const activeQuestion = currentQuestionIndex + 1

    return (
      <div className="quizgame-container">
        <Header />
        <div className="quizgame-bottom-container">
          <div className="timelimit-container">
            <div className="question-number">
              <p>Question</p>
              {/* Displaying active question number and total questions */}
              <p className="paragraph">
                {activeQuestion} / {totalQuestions}
              </p>
            </div>

            <p className="timelimit">{timer}</p>
          </div>

          {/* Question text */}
          <p className="questionText" key={currentQuestion.id}>
            {currentQuestion.question_text}
          </p>

          {/* Rendering question options */}
          <div>{this.renderQuestionOptions(currentQuestion)}</div>

          {/* Next button */}
          <button
            type="button"
            onClick={this.handleNextQuestion}
            disabled={!isNextEnabled}
            className={`next-button ${buttonStyle}`}
          >
            {activeQuestion === totalQuestions ? 'Submit' : 'Next Question'}
          </button>
        </div>
      </div>
    )
  }

  render() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderQuestionsData()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default QuizGameRoute
