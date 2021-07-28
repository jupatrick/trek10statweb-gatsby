import React from "react"
import { graphql } from "gatsby"

const textStyle = {
    color: "#0F0FA2",
    fontSize: 48,
    fontFamily: "sans-serif" 
  }



  const ComponentName = ({ data }) => <pre>{JSON.stringify(data, null, 4)}</pre>

  export const query = graphql`
    {
      craftTest1Test1Entry {
        title
        url
      }
    }
  `
  
  export default ComponentName
