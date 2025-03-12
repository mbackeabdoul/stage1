"use client"
import styled from "styled-components"

export default function Description() {

  const Para = styled.h1`
    font-size: 45px;
   
     text-align: center;
     font-weight: 400px;
     font-family: Beatrice Deck Trial;
     padding-top: 10px;

       @media (max-width: 600px) {
       padding: 1rem;
        font-size: 25px;
}
     

`
  const Para1 = styled.p`
 font-size: 16px;
     text-align: center;
     font-weight: 300px;
     padding-bottom: 70px;
     font-family: Beatrice Trial;
   

`


  return (
    <main >

      <Para>Our Approach to fashion design </Para>

      <Para1>
        at elegant vogue , we blend creativity with craftsmanship to create <br /> fashion that transcends trends and stands
        the test of time each <br /> design is meticulously
        crafted, ensuring the highest quelity exqulsite finish
      </Para1>

    </main>
  )
}

