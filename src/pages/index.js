import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"
import { graphql } from "gatsby"


const headingStyle = {
  marginTop: 10,
  marginBottom: 10,
}

const textStyle = {
  color: "#0F0FA2",
  fontSize: 48,
  fontFamily: "sans-serif" 
}



export const query = graphql`
  {
    craftTest1Test1Entry {
      richText
    }
  }
`

export default function Home( { data } ) {
  console.log(data)
  return (
    <h1 style = {headingStyle}> 
      <span style = {textStyle}> Proof of Concept - wip </span>
      <StaticImage
        src="../images/Trek10-Light.png"
        width = {600}
        alt= "Logo"
        placeholder="tracedSVG"
      />
      <br></br>
      S3 image below
      <br></br>
      <span style = {textStyle}> </span>
    </h1>
    
    
  )
}




