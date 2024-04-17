// @ts-nocheck 

import { useContext, useEffect, useRef, useState } from 'react'
import audioBufferSlice from 'audiobuffer-slice'
import toWav from 'audiobuffer-to-wav'
import InputRange from 'react-input-range';
import imagejs from 'image-js'

import { ImageSelected, InstanceContainer, Button } from './styles';
import { Container, Flex, Input, SVGItem, UploadArea, InputField, Label } from '../MainCreate/styled';

import './range.css'
import { Pause, Play } from '../../assets/icons/utils/AudioStatus';
import { CreationContext } from '../context/CreationContext';
import { socket } from '../../config/socket';
import axios from 'axios'


interface InputType {
  title: string
  name: string
  onChange: (e: any) => void
}

interface RangeType {
  min: number
  max: number
}

interface InstanceType {
  index: number
}

const TextInput = ({ value, title, onChange, name }: InputType) => {
  return (
    <InputField>
      <Label>{title}</Label>
      <Input value={value} onChange={onChange} name={name} type="text"/>
    </InputField>
  )
}

const NewInstance = ({ index }: InstanceType) => {
  const { appendAudioBlob, appendImageBlob, setQuizInput, input, setLogger, youtubeUrl, setYTUrl } = useContext(CreationContext)
  const audioRef = useRef(null)
  const fileRef = useRef(null)
  const imageFileRef = useRef(null)
  const [imageLoaded, setImageLoad] = useState<boolean>(false)
  const [playing, setPlaying] = useState<boolean>(false)
  const [duration, setDuration] = useState<number>(0)
  const [range, setRange] = useState<RangeType>({ min: 0, max: 30 })
  const [errorLog, setError] = useState([])

  const handleImageUpload = async (e) => {
    e.preventDefault()

    const file = e.target.files[0]
    const fr = new FileReader()

    fr.readAsArrayBuffer(file)

    fr.onload = async function() {
      const imageLoad = await imagejs.load(fr.result)
      const resized = imageLoad.resize({ width: 300 })
      const imageString = resized.toDataURL()
      const dataFetch = await fetch(imageString).then(res => res.blob())
      const url = URL.createObjectURL(dataFetch);

      appendImageBlob(dataFetch, index)
      setImageLoad(true)
      imageFileRef.current.src = url
    }
  }

  const sliceAndPlay = async (e) => {
    e.preventDefault()

    const audioContext = new AudioContext();
    const arrayBuffer = await fileRef?.current.files[0].arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    audioBufferSlice(audioBuffer, range.min * 1000, range.max * 1000, function(error, slicedAudioBuffer) {
      if (error) {
        console.error(error);
      } else {
        try {
          const wav = toWav(slicedAudioBuffer)

          const blob = new Blob([ new DataView(wav) ], {
            type: 'audio/mpeg'
          })

          const url = URL.createObjectURL(blob)
  
          audioRef.current.src = url
          audioRef.current.play()
        } catch (error) {
          setLogger(JSON.stringify(error))
        }
      }
    });
  }

  const pauseInProgress = (e) => {
    e.preventDefault()
    audioRef.current.pause()
  }

  const handleTextInput = (e) => setQuizInput(e, index)

  const storeBlob = async () => {
    const audioContext = new AudioContext();
    const arrayBuffer = await fileRef?.current.files[0].arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    audioBufferSlice(audioBuffer, range.min * 1000, range.max * 1000, function(error, slicedAudioBuffer) {
      if (error) {
        console.error(error);
      } else {
        try {
          const wav = toWav(slicedAudioBuffer)

          const blob = new Blob([ new DataView(wav) ], {
            type: 'audio/mpeg'
          })

          return appendAudioBlob(blob, index)
        } catch (error) {
          setLogger(JSON.stringify(error))
        }
      }
    })
  }

  const handleAudioUpload = async (e) => {
    e?.preventDefault()
    const audioContext = new AudioContext();
    const file = e ? e.target.files[0] : fileRef?.current.files[0]
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    setDuration(audioBuffer.duration)

    audioBufferSlice(audioBuffer, range.min * 1000, audioBuffer.duration * 1000, function(error, slicedAudioBuffer) {
      if (error) {
        console.error(error);
      } else {
        try {
          const wav = toWav(slicedAudioBuffer)

          const blob = new Blob([ new DataView(wav) ], {
            type: 'audio/mpeg'
          })

          if(audioRef.current){
            audioRef.current.pause()
            audioRef.current.currentTime = 0
          }
  
          return appendAudioBlob(blob, index)
        } catch (error) {
          console.log(error)
          setLogger(JSON.stringify(error))
        }
      }
    })
  }

  const handleYTInput = (({ target: { value } }) => setYTUrl(value))

  const handleYTSubmit = (e) => {
    e.preventDefault()

    const redoClone = [...errorLog]
    redoClone[index] = ""
    setError(redoClone)

    axios
      .post(
        "https://tsunapop-0add06afd0c3.herokuapp.com/",
        { url: input.quizItems[index]?.youtubeUrl },
        {
          responseType: "blob"
        }
      )
      .catch(err => console.log(err))
      .then(async (response) => {
        const data = new Blob([response.data]);
        console.log(response)

        if(response?.headers?.["content-type"] === "application/json"){
          const textData = JSON.parse(await data.text())

          if(textData?.status === 400){
            const errorClone = [...errorLog]
            errorClone[index] = textData?.error
            setError(errorClone)

            throw 'error'
          }
        }

        fileRef.current = {
          files: [data]
        }
      }).then(handleAudioUpload);
  }

  const removeContent = async (e) => {
    e.preventDefault()

    audioRef.current.pause()

    setTimeout(() => {
      if(fileRef?.files?.length){
        const fileListArr = Array.from(fileRef.files);
        fileListArr.splice(1, 1);
      } 

      audioRef.current.src = ""  
      setDuration(0)
    }, 500);

  }

  const timeFormat = (duration) => {
    // Hours, minutes and seconds
    const hrs = ~~(duration / 3600);
    const mins = ~~((duration % 3600) / 60);
    const secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    let ret = "";

    if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;

    return ret;
  }

  useEffect(() => {
    console.log(socket)
    socket.on("videoDetails", (details) => console.log(details))
  }, [])

  return (
    <Flex style={{ gap: 32, marginBottom: 40, alignItems: "flex-start" }}>
      <InstanceContainer>
        <UploadArea>
          <ImageSelected style={{ display: imageLoaded ? "block" : "none" }} ref={imageFileRef}/>
          <SVGItem viewBox="0 0 24 24">
            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
          </SVGItem>
          <Input onChange={handleImageUpload} accept="image/png, image/jpeg,image/webp" type="file"/>
        </UploadArea>
      </InstanceContainer>
      <Container>
        <TextInput value={input.quizItems[index].cardTitle} onChange={handleTextInput} name="cardTitle" title="Titulo do Card"/> 
        <TextInput value={input.quizItems[index].variations} onChange={handleTextInput} name="variations" title="Respostas (Separe por virgulas)"/>
        <Label>Seleção de Musica</Label>

        <Flex style={{ gap: 14, alignItems: 'center', marginTop: 24 }}>
          <UploadArea style={{ minWidth: 55 }} width={55} height={55} radius={7}>
            <SVGItem width={20} height={20} viewBox="0 0 24 24">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" /></svg>
            </SVGItem>
            <Input ref={fileRef} onChange={handleAudioUpload} accept=".mp3,.wav,.mpeg" type="file"/>
          </UploadArea>

          {
            !duration ? (
              <Flex style={{ gap: 14, alignItems: 'center', marginLeft: 16, width: '100%' }}>
                <TextInput value={input.quizItems[index].youtubeUrl} onChange={handleTextInput} name="youtubeUrl" title="Link do YouTube"/> 

                <UploadArea style={{ minWidth: 55 }} width={55} height={55} radius={7}>
                  <SVGItem width={20} height={20} viewBox="0 0 24 24">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" /></svg>
                  </SVGItem>
                  <Button onClick={handleYTSubmit}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px">
                      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                    </svg>
                  </Button>
                </UploadArea>
                <Label style={{ color: "#f00", fontSize: 12, width: 200 }}>{errorLog[index]}</Label>
              </Flex>
            ) : null
          }
          {
            duration ? (
              <>
                <Button style={{ marginRight: 10 }} width={55} height={55} radius={7} onClick={(e) => !playing ? sliceAndPlay(e) : pauseInProgress(e)}>
                  { playing ? <Pause/> : <Play/>}
                  <audio  
                    onPlay={() => setPlaying(true)} 
                    onPause={() => setPlaying(false)}
                    style={{ position: 'absolute' }} 
                    ref={audioRef} 
                    src=""
                  />
                </Button>
                <InputRange
                  value={range} 
                  minValue={0}
                  formatLabel={value => `${timeFormat(value)}`}
                  maxValue={Math.floor(duration)}
                  onChangeComplete={storeBlob}
                  onChange={value => {
                    audioRef.current.pause()
                    setRange(value)
                  }}
                />
                <Button style={{ marginLeft: 10 }} width={55} height={55} radius={7} onClick={removeContent}>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </Button>
              </>
            ) : null
          }
        </Flex>
      </Container>
      {/* <Button svgSize={20} width={48} height={48} onClick={(e) => {
        e.preventDefault()
        removeField(index)
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
        </svg>
      </Button> */}
    </Flex>
  )
}
export default NewInstance