// @ts-nocheck 

import { useContext, useRef, useState, useEffect } from 'react'
import { Checked, Unchecked } from '../../assets/icons/utils/CheckStatus'
import { CreationContext } from '../context/CreationContext'
import NewInstance from '../NewInstance'
import { ImageSelected } from '../NewInstance/styles'
import imagejs from 'image-js'

import { 
  Main,
  PageTitle,
  Form,
  InputField,
  Label,
  Input,
  UploadArea,
  SVGItem,
  Flex,
  Container,
  Submit,
  ProgressBar,
  Error
} from './styled'

interface InputType {
  title: string
  name: string
  onChange: (e: any) => void
}

const TextInput = ({ title, onChange, name }: InputType) => {
  return (
    <InputField>
      <Label>{title}</Label>
      <Input onChange={onChange} name={name} type="text"/>
    </InputField>
  )
}

const CheckInput = ({ title, onChange, name }: InputType) => {
  const { input } = useContext(CreationContext)

  return (
    <InputField type="checkbox">
      <Label htmlFor={name}>{title}{ input[name] ? <Checked/> : <Unchecked/> }</Label>
      <Input onChange={onChange} name={name} id={name} type="checkbox"/>
    </InputField>
  )
}

const requiredFields = [
  {
    field: "quizName",
    minLength: 1,
    type: 'string'
  },
  {
    field: "author",
    minLength: 1,
    type: 'string'
  },
  {
    field: "mainImage",
    type: 'blob'
  },
]

const requiredQuiz = [
  {
    field: "cardTitle",
    minLength: 1,
    type: 'string'
  },
  {
    field: "variations",
    minLength: 1,
    type: 'string'
  },
  {
    field: "audioBlob",
    type: 'blob'
  },
  {
    field: "imageBlob",
    type: 'blob'
  },
]

const MainCreate = () => {
  const { input, setInput, setMainImage, createInstance, uploadProgress, setLogger, logger } = useContext(CreationContext)
  const imageFileRef = useRef(null)
  const [imageLoaded, setImageLoad] = useState<boolean>(false)

  const addInstance = () => {
    setInput({...input, quizItems: [...input.quizItems, { ytProgress: 0, cardTitle: '', variations: '', audioBlob: null, imageBlob: null }]})
  }

  const handleTextInput = ({ target: { name, value } }) => setInput({...input, [name]: value})

  const submitQuiz = (e) => {
    e.preventDefault()

    const validMain = requiredFields.every(({ field, minLength, type }, index) => {
      if(!input[field]) {
        setLogger(`[${index + 1}] Campo "${field}" não preenchido`)
        return false
      }

      return true
    })

    const validQuiz = !!input.quizItems.length && input.quizItems.every((item) => {
      if(!item) return false

      const validItem = requiredQuiz.every((({ field, minLength, type }, index) => {
        if(!item[field]) {
          setLogger(`[${index + 1}] Campo "${field}" não preenchido`)
          return false
        }

        return true
      }))

      return validItem
    })

    if(validQuiz && validMain){
      setLogger("")
      createInstance()
    }
  }

  const handleImageUpload = (e) => {
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

      setImageLoad(true)
      setMainImage(dataFetch)
      imageFileRef.current.src = url
    }
  }

  const handleCheck = ({ target: { checked, name } }) => setInput({...input, [name]: checked})

  // useEffect(() => {
  //   window.addEventListener('beforeunload', (e) => {
  //     alert("!!")
  //     console.log(e)
  //   })

  // }, [])


  return (
    <Main>
      <PageTitle>Crie seu <br/>Quiz</PageTitle>
      <Form>
        <TextInput onChange={handleTextInput} name="quizName" title="Nome do Quiz"/>
        <TextInput onChange={handleTextInput} name="quizDescription" title="Descrição do Quiz (Opcional)"/>
        <Flex>
          <InputField>
            <Label>Imagem de Capa</Label>
            <UploadArea>
              <ImageSelected style={{ display: imageLoaded ? "block" : "none" }} ref={imageFileRef}/>
              <SVGItem viewBox="0 0 24 24">
                <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
              </SVGItem>
              <Input onChange={handleImageUpload} accept="image/png, image/jpeg" type="file"/>
            </UploadArea>
          </InputField>
          <Container>
            <TextInput onChange={handleTextInput} name="author" title="Nome do Autor"/> 
            <TextInput onChange={handleTextInput} name="authorHandle" title="Twitter do Autor (ex: @username) (Opcional)"/>
            <CheckInput onChange={handleCheck} name="dmcaNotice" title="Contem musica licenciada (DMCA)"/>
          </Container>
        </Flex>
        <Label style={{ marginTop: 50 }}>Lista de Musicas</Label>
        {
          input.quizItems.map((_, index) => <NewInstance index={index} key={index}/>)
        }
        <UploadArea onClick={addInstance} large={true}>
          <SVGItem viewBox="0 0 24 24">
            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
          </SVGItem>
        </UploadArea>
      </Form>
      {logger ? <Error>{logger}</Error> : null}
      <Submit onClick={submitQuiz} type='submit'>
        Enviar Quiz
        <ProgressBar barWidth={(uploadProgress[0] / uploadProgress[1]) * 100}/>
      </Submit>
    </Main>
  )
}

export default MainCreate