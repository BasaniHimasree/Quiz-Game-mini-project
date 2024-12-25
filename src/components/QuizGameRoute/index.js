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
    timer: 15,
    isNextEnabled: false,
    correctlyAttempted: 0,
    unAttemptedQuestions: 0,
    wrongAnswers: 0,
    totalQuestions: 10,
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
    const {timer} = this.state
    if (timer > 0) {
      this.setState(prevState => ({timer: prevState.timer - 1}))
    } else {
      this.handleNextQuestion(true) // Move to next question if time runs out
    }
  }

  handleOptionSelect = optionId => {
    const {currentQuestionIndex, questions, timer} = this.state
    const correctOption = questions[currentQuestionIndex].options.find(
      opt => opt.is_correct,
    )
    const isCorrect = optionId === correctOption.id
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
          isNextEnabled: true,
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
    } = this.state

    if (currentQuestionIndex + 1 < questions.length) {
      this.setState(
        prevState => ({
          currentQuestionIndex: prevState.currentQuestionIndex + 1,
          timer: 15,
          selectedOption: null,
          isNextEnabled: false,
        }),
        this.decrementTimer,
      )
    } else {
      const {history} = this.props
      this.setState(
        prevState => ({
          correctlyAttempted: prevState.correctlyAttempted,
          totalQuestions: prevState.totalQuestions,
          wrongAnswers: prevState.wrongAnswers,
          unAttemptedQuestions: prevState.unAttemptedQuestions,
        }),
        () => {
          localStorage.setItem(
            'quizResults',
            JSON.stringify({
              correctlyAttempted,
              totalQuestions,
              wrongAnswers,
              unAttemptedQuestions,
            }),
          )

          history.push('/game-results', {
            correctlyAttempted,
            totalQuestions,
            unAttemptedQuestions,
            wrongAnswers,
          })
        },
      )
    }
  }

  renderQuestionOptions = question => {
    const {selectedOption} = this.state

    switch (question.options_type) {
      case 'DEFAULT':
        return (
          <div>
            <p className="questionText" key={question.id}>
              {question.question_text}
            </p>
            <ul className="all-options">
              {question.options.map(option => (
                <li className="each-item" key={option.id}>
                  <button
                    type="button"
                    aria-label="close"
                    className="onclick-button"
                    onClick={() =>
                      !selectedOption && this.handleOptionSelect(option.id)
                    }
                  >
                    {option.text}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )
      case 'IMAGE':
        return (
          <div>
            <p className="questionText" key={question.id}>
              {question.question_text}
            </p>
            <ul className="all-images">
              {question.options.map(option => (
                <li className="each-item" key={option.id}>
                  <img
                    src={option.image_url}
                    alt={option.text}
                    aria-label="close"
                    className="image-button"
                    onClick={() =>
                      !selectedOption && this.handleOptionSelect(option.id)
                    }
                  />
                </li>
              ))}
            </ul>
          </div>
        )

      case 'SINGLE_SELECT':
        return (
          <div>
            <p className="questionText" key={question.id}>
              {question.question_text}
            </p>
            <ul className="all-options">
              {question.options.map(option => (
                <li className="each-item" key={option.id}>
                  <input
                    type="radio"
                    id={`option-${option.id}`}
                    className="onclick-button"
                    aria-label="close"
                    value={option.text}
                    onClick={() =>
                      !selectedOption && this.handleOptionSelect(option.id)
                    }
                  />
                  <label htmlFor={`option-${option.id}`}>{option.text}</label>
                </li>
              ))}
            </ul>
          </div>
        )

      default:
        return null
    }
  }

  onClickButton = () => {
    this.fetchQuestions()
  }

  renderFailureView = () => (
    <div className="quizgame-container">
      <img
        src="https://res.cloudinary.com/dzy53xuxa/image/upload/v1728795223/Group_7519_hnlpnh.png"
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
              <p className="paragraph">
                {currentQuestionIndex + 1} / {questions.length}
              </p>
            </div>

            <p className="timelimit">{timer}</p>
          </div>

          <div>{this.renderQuestionOptions(currentQuestion)}</div>

          <button
            type="button"
            onClick={this.handleNextQuestion}
            disabled={!isNextEnabled}
            className={`onclick-button ${buttonStyle}`}
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
