// @ts-nocheck 

import { useContext, useEffect, useRef, useState } from "react"
import { Play, Pause } from "../../assets/icons/utils/AudioStatus"
import { 
  Item, 
  Image, 
  ImageWrapper,
  Title,
  TitleWrapper,
  Input,
  InputWrapper,
  ProgressBar,
  Reveal,
  UserOverlay,
  YouTubeButton
} from "./styles"

interface QuizTypes {
  name: string,
  audioPath: string,
  imagePath: string,
  variations: string[]
}

interface Props {
  quizItem: any
  cardBackground: string
  setCurrent: any
  index: number
}

const YT = () => (
  <svg width={32} height={16}>
  <defs>
  <clipPath id="clip1">
    <path d="M 0.171875 0 L 22.832031 0 L 22.832031 16 L 0.171875 16 Z M 0.171875 0 "/>
  </clipPath>
  </defs>
  <g id="surface1">
  <g clip-path="url(#clip1)" clip-rule="nonzero">
  <path fill="rgb(100%,0%,0%)"d="M 22.355469 2.5 C 22.09375 1.515625 21.328125 0.742188 20.351562 0.476562 C 18.585938 0 11.5 0 11.5 0 C 11.5 0 4.414062 0 2.648438 0.476562 C 1.671875 0.742188 0.90625 1.515625 0.644531 2.5 C 0.171875 4.28125 0.171875 8 0.171875 8 C 0.171875 8 0.171875 11.71875 0.644531 13.5 C 0.90625 14.484375 1.671875 15.257812 2.648438 15.523438 C 4.414062 16 11.5 16 11.5 16 C 11.5 16 18.585938 16 20.351562 15.523438 C 21.328125 15.257812 22.09375 14.484375 22.355469 13.5 C 22.828125 11.71875 22.828125 8 22.828125 8 C 22.828125 8 22.828125 4.28125 22.355469 2.5 Z M 22.355469 2.5 "/>
  </g>
  <path fill="#fff" d="M 9.230469 11.429688 L 15.117188 8 L 9.230469 4.570312 Z M 9.230469 11.429688 "/>
  </g>
</svg>
)

import "./style.css"
import { QuizContext } from "../context/QuizContext"

const ItemGuess = ({ quizItem, addCount, cardBackground, index }: Props) => {
  const { volume, setCurrent, setQuiz } = useContext(QuizContext)
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [correct, setCorrect] = useState<boolean>(false)
  const [forfeit, setForfeit] = useState<boolean>(false)
  const [input, setInput] = useState<string>("")
  const { name, audioUrl, imageUrl, variations, guessedBy, guessedColor } = quizItem

  const toggleAudio = () => {
    if(!audioRef.current) return

    const audioElements = document.querySelectorAll("#audio-item")
    const status = audioRef?.current?.paused

    const pausePromise = Promise.all([...audioElements].map(el => {
      const element = el as HTMLAudioElement
      
      if(!status) return 

      element.currentTime = 0
      return element.pause()
    }))


    return pausePromise.then(() => {
      audioRef.current[status ? "play" : "pause"]()
    })
  }

  const updateProgress = (e) => {
    const { target: { currentTime, duration } } = e
    const relativeProgress = (currentTime / duration) * 100

    return setProgress(relativeProgress)
  }

  useEffect(() => {
    if(!variations.map(e => e.toLowerCase()).includes(input.toLowerCase())) return
    if(guessedBy) return

    setCorrect(true)
    setQuiz(quizData => {
      const { quizItems } = quizData
      const itemsClone = [...quizItems]

      itemsClone[index].guessedBy = "Você"
      itemsClone[index].guessedColor = "#559b54"

      return {
        ...quizData,
        quizItems: itemsClone
      }
    })
  }, [input])

  useEffect(() => {
    if(correct) addCount()
  }, [correct])

  useEffect(() => {
    if(audioRef.current) audioRef.current.volume = volume / 100
  }, [volume])

  return (
    <Item color={guessedColor} correct={guessedBy || correct}>
      <TitleWrapper>
        <Title>{name}</Title>
        {/* {
          (guessedBy || correct || forfeit) ? (
            <YouTubeButton>
              <YT/>
            </YouTubeButton>
          ) : ""
        } */}
        <Reveal onClick={() => setForfeit(true)}>
          <svg style={{ width: 16, height: 16 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="#fff" d="M17,21L14.25,18L15.41,16.84L17,18.43L20.59,14.84L21.75,16.25M12.8,21H5C3.89,21 3,20.11 3,19V5C3,3.89 3.89,3 5,3H19C20.11,3 21,3.89 21,5V12.8C20.39,12.45 19.72,12.2 19,12.08V5H5V19H12.08C12.2,19.72 12.45,20.39 12.8,21M12,17H7V15H12M14.68,13H7V11H17V12.08C16.15,12.22 15.37,12.54 14.68,13M17,9H7V7H17" />
          </svg>
        </Reveal>
      </TitleWrapper>
      <ImageWrapper onClick={toggleAudio}>
        <UserOverlay active={correct ? false : guessedBy}>{guessedBy}</UserOverlay>
        <Image src={(correct || forfeit || guessedBy) ? imageUrl : cardBackground} alt={name} />
        <Image style={{ visibility: "hidden", pointerEvents: "none", width: 0, height: 0 }} src={imageUrl} alt={name} />
        <ProgressBar style={{ width: `${progress}%` }}/>
        { playing ? 
          <Play className="play-status"/> 
        : <Pause className="play-status"/> }
      </ImageWrapper>
      <InputWrapper>
        <Input disabled={forfeit || guessedBy} value={(forfeit || guessedBy) ? variations.join(", ") : input} style={forfeit ? { backgroundColor: "#f23f3f", color: "#fff" } : {}} onChange={({ target: { value } }) => setInput(value)} type="text" />
      </InputWrapper>
      <audio onPlay={() => {setPlaying(true); setCurrent(() => index)}} onPause={() => {setPlaying(false); setCurrent(() => null)}} onTimeUpdate={updateProgress} id="audio-item" ref={audioRef} src={audioUrl}></audio>
    </Item>
  )
}
export default ItemGuess