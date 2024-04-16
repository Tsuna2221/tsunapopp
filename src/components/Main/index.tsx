// @ts-nocheck 

import { useContext, useEffect, useState } from 'react';
import axios from 'axios'
import { socket } from '../../config/socket';

import { Main as MainWrapper, Grid, Count, Container, Title, Description, InputRange, ChannelForm, ChannelInput, ChannelSubmit } from "./styles"
import ItemGuess from "../ItemGuess";

import Loader from '../Loader';
import { QuizContext } from '../context/QuizContext';

const URL = process.env.NODE_ENV === 'production' ? "https://tsunapop-0add06afd0c3.herokuapp.com/" : "http://localhost:5000"

const Main = () => {
  const { setVolume, volume, quiz, loading } = useContext(QuizContext)
  const [count, setCount] = useState<number>(0)
  const [time, setTime] = useState(0);
  const [channel, setChannel] = useState("")
  const [connect, setConnect] = useState(false)

  const addCount = () => setCount(count + 1)

  const disconnect = (e) => {
    e.preventDefault();
    socket.disconnect()

    localStorage.removeItem('channel_name')

    setConnect(false)
  }
  
  const connectToChat = (e) => {
    e?.preventDefault();

    socket.disconnect()

    socket.connect()
    setConnect('loading')

    localStorage.setItem('channel_name', channel)
    axios.post(`${URL}/init`, {
      channel_name: channel
    })
  }

  useEffect(() => {
    if(count === quiz?.quizItems?.length) return
    setTimeout(() => {
      setTime((time + 100))
    }, 1000)
  }, [time]);

  useEffect(() => {
    const cachedChannel = localStorage.getItem('channel_name')
    if(cachedChannel){
      setChannel(cachedChannel)
      connectToChat()
    }

    socket.on("twitchConnected", () => {
      setConnect(() => true)
    })
  }, [])

  const minutes = Math.floor((time % 360000) / 6000);
  const seconds = Math.floor((time % 6000) / 100);

  return (
    <MainWrapper>
      <Grid>
        {
          loading ? <Loader/> : 
          <>
            <Container>
              <Count>{count}/{quiz.quizItems.length}</Count>
              <Title>{quiz.quizName}</Title>
              <Description>{quiz.quizDescription} por: {quiz.author}</Description>
              <Count>{minutes.toString().padStart(2, "0")}:
                {seconds.toString().padStart(2, "0")}
              </Count>

              <ChannelForm onSubmit={connect ? disconnect : connectToChat}>
                <input autoComplete="false" name="hidden" type="text" style={{ display: 'none' }}></input>
                <ChannelInput value={channel} autoComplete='off' onChange={(({target: { value }}) => setChannel(value))} placeholder="Nome do canal"></ChannelInput>
                <ChannelSubmit type="submit">{connect ? connect === 'loading' ? 'Conectando...' :  "Desconectar" : "Conectar" }</ChannelSubmit>
              </ChannelForm>

            </Container>
            { quiz.quizItems.map((item, index) => <ItemGuess key={item.id} index={index} addCount={addCount} cardBackground={quiz.cardBackground} quizItem={item}/>) }
            <InputRange onChange={({ target: { value } }) => setVolume(parseInt(value))} value={volume} min={0} max={100} type="range" />
          </>
        }
      </Grid>
    </MainWrapper>
  )
}

export default Main
