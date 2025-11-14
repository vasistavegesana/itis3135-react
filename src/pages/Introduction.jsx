import introPhoto from '../assets/intro-photo.png'

const Introduction = () => (
  <>
    <h2>Introduction</h2>

    <figure>
      <img
        src='intro-photo.png'
        alt="Vasista on a rooftop garage in Atlanta"
        width="400"
        loading="lazy"
      />
      <figcaption>
        <em>On a rooftop garage in Atlanta</em>
      </figcaption>
    </figure>

    <p>
      <strong>Personal Background:</strong> I am currently a student at UNC Charlotte majoring in
      Computer Science with a focus on AI, robotics and gaming. I have experience with Java, HTML,
      and Python, and I enjoy experimenting with building new AI tools. Outside of academics, I like
      hanging out with friends, swimming, and going out to explore new places.
    </p>

    <p>
      <strong>Professional Background:</strong> I haven't had much experience yet, but I have
      participated in several hackathons and built a couple cool projects and small games.
    </p>

    <p>
      <strong>Academic Background:</strong> I'm currently a junior at UNC Charlotte with a
      concentration in AI, robotics, and gaming.
    </p>

    <p>
      <strong>Background in this Subject:</strong> I have experience with Java, HTML, and Python, and
      I'm excited to learn more about front-end development.
    </p>

    <p>
      <strong>Primary Computer Platform:</strong> MacBook Pro (2017)
    </p>

    <p>
      <strong>Courses I'm Taking &amp; Why:</strong>
    </p>
    <ul>
      <li>CTCM 2530 — Degree Requirement</li>
      <li>INFO 2130 — Intro to Business Computing (Degree requirement for minor)</li>
      <li>ITIS 3135 — Front-End Web App Development (very interested; skills for future endeavors)</li>
      <li>ITSC 2175 — Logic and Algorithms (degree requirement; want to learn more)</li>
      <li>STAT 2122 — Intro to Prob &amp; Stat (Degree Requirement)</li>
      <li>ITIS 3688 — Computers &amp; Their Impact on Society (Degree Requirement)</li>
    </ul>

    <p>
      <strong>A quote I live by:</strong> "The best way to predict the future is to invent it." - Alan
      Kay
    </p>
  </>
)

export default Introduction
