import styled from "styled-components"

export const Main = styled.main`
  padding: 0 50px;
  max-width: 1050px;
  margin: 0 auto;
`

export const PageTitle = styled.h1`
  color: #ebebeb;
  font-size: 42px;
`

export const Form = styled.form`

`

export const Container = styled.div`
  width: 100%;
`

export const InputField = styled.div<{ type?: string }>`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
  width: 100%;

  ${({ type }) => type === "checkbox" ? `
    align-items: center;
    flex-direction: row;

    label{
      margin: 0px;
      display: flex;
      align-items: center;
    }

    input{
      display: none;
    }

    svg{
      width: 40px;
      height: 40px;
      margin-left: 12px;

      path{
        fill: #fff;
      }
    }
  ` : ''}
`

export const Label = styled.label`
  color: #ebebeb; 
  font-size: 18px;
  margin-bottom: 8px;
  display: block;
`

export const Input = styled.input`
  width: 100%;
  height: 48px;
  outline: none;
  border: 1px solid transparent;
  padding: 0 16px;
  font-size: 16px;
  border-radius: 4px;
  transition: 0.3s ease;

  &[type="file"]{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    cursor: pointer;
    opacity: 0;
  }

  &:focus{
    border: 1px solid #333;
  }
`

export const UploadArea = styled.div<{ large?: boolean, width?: number, height?: number, radius?: number }>`
  position: relative;
  width: ${({width}) => width ? `${width}px` : `170px`};
  height: ${({height}) => height ? `${height}px` : `220px`};
  border: 1px dotted #ffffff;
  border-radius: ${({radius}) => radius ? `${radius}px` : `30px`};;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: #55556e;
  transition: 0.2s ease;

  &:hover{
    background-color: #4f4f66;
  }

  ${({ large }) => large ? `
    width: 100%;
    height: 150px;
    cursor: pointer;
  ` : ''}
`

export const SVGItem = styled.svg<{ width?: number, height?: number }>`
  width: ${({width}) => width ? `${width}px` : `80px`};
  height: ${({height}) => height ? `${height}px` : `80px`};
  display: flex;
  align-items: center;
  justify-content: center;

  path{
    fill: #ebebeb;
  }
`

export const Flex = styled.div`
  display: flex;
  gap: 80px;
`


export const Submit = styled.button`
  width: 100%;
  height: 48px;
  border: 1px solid #fff;
  border-radius: 6px;
  background-color: transparent;
  margin: 24px 0 60px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  transition: 0.2s ease;
  position: relative;
  overflow: hidden;

  &:hover{
    color: #55556e;
    background-color: #fff;
  }
`

export const ProgressBar = styled.div<{ barWidth: number }>`
  position: absolute;
  top: 0;
  left: 0;
  transition: 0.3s ease;
  background-color: #5a0595;
  width: ${({ barWidth }) => `${barWidth}%`};
  height: 100%;
`

export const Error = styled.p`
  font-size: 18px;
  color: #ff0037;
  margin: 18px 0;
`

