import { Form, useLoaderData } from "react-router-dom";
import Select from 'react-select';

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
          <Select options={[{value: "one", label: "one"}, {value: "two", label: "two"}]} placeholder="fucku" defaultValue={{value: "three", label: "three"}}/>
        </Form>
    </div>
  )
}
