import { Form, useLoaderData } from "react-router-dom";

export default function About() {

  const x = useLoaderData()
  return (
    <div>
        <h2>This is Chordify</h2>
        <p>Save chord progressions of songs to analyse and use to write your own songs</p>
        <p>{x}</p>
        {console.log(x)}
        <Form>
          <label>For testing</label>
          <select defaultValue={"hi"}>
            <option value="nigga">hi</option>
            <option value="hi">bye</option>
          </select>
        </Form>
    </div>
  )
}
