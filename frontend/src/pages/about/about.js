import { Form, useLoaderData } from "react-router-dom";
import AsyncSelect from 'react-select/async';
import { Chord } from "../../util/classes/Chord";
import { useState } from "react";

const colourOptions = Chord.generateAllChordOptions()


const filterColors = (inputValue) => {
  return colourOptions.filter((i) =>
    i.label.toLowerCase().includes(inputValue.toLowerCase())
  );
};

const loadOptions = (inputValue, callback) => {
  setTimeout(() => {
    callback(filterColors(inputValue));
  }, 1000);
};

export default function About() {

  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [input, setInput] = useState("");

  const x = useLoaderData()
  return (
    <div>
        <h2>This is Chordify</h2>
        <p>Save chord progressions of songs to analyse and use to write your own songs</p>
        <p>{x}</p>
        {console.log(x)}
        <Form>
          <label>For testing</label>                  
          <AsyncSelect 
            cacheOptions 
            loadOptions={loadOptions} 
            defaultOptions
            placeholder="testing"
            onInputChange={(value) => {
              if (value) {
                setMenuIsOpen(true);
              } else {
                setMenuIsOpen(false);
              }
            }}
            menuIsOpen={menuIsOpen}
          />
        </Form>
    </div>
  )
}
