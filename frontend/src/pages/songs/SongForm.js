import React, { useEffect } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { generateAllChordOptions, generateAllKeyOptions } from '../../util/chords';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import "../../styles/pages/songs/SongForm.css"
import Select from 'react-select'
import { parseSong, songChordToChordString } from '../../util/songs';

const chordOptions = generateAllChordOptions();
const keyOptions = generateAllKeyOptions();

function CloneChord({ control, insert, sectionIndex, chordIndex }) {
  const chordValues = useWatch({
    control,
    name: `sections.${sectionIndex}.chords`
  });

  return (
    <label onClick={() => insert(chordIndex + 1, chordValues[chordIndex])}>Copy</label>
  )
}

function CloneSection({ control, insert, sectionIndex }) {
  const sectionValues = useWatch({
    control,
    name: 'sections'
  });

  return (
    <label onClick={() => insert(sectionIndex + 1, sectionValues[sectionIndex])}>Copy</label>
  )
}

const Chord = ({ chord, sectionIndex, chordIndex, register, control }) => {
  return (
    <>
      <label>Chord</label>
      <Controller
        name={ `sections.${sectionIndex}.chords.${chordIndex}.chordString` }
        control={ control }

        render={ ({ field: { onChange } }) => (
          <Select
            options={ chordOptions }
            onChange={ selectedOption => onChange(selectedOption.value) }
            defaultValue={ chordOptions.find(({value}) => value === chord.chordString) }
          />
        ) }
      />
      <div className="songForm__lyric">
        <label>Lyrics</label>
        <input
          {...register(`sections.${sectionIndex}.chords.${chordIndex}.lyric`)} 
        />
      </div>
    </>
  )
}

const Section = ( { section, sectionIndex, control, register } ) => {

  const name = `sections.${sectionIndex}.chords`;

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: name, // unique name for your Field Array
  });

  return (
    <>
      <div className="songForm__sectionName">
        <label>Section name</label>
        <input
          {...register(`sections.${sectionIndex}.name`)} 
        />
      </div>
      <div className="songForm__sectionKey"> 
        <label>Section key</label>
        <Controller
        name={ `sections.${sectionIndex}.keyString` }
        control={ control }
        render={ ({ field: { onChange } }) => (
          <Select
            options={ keyOptions }
            onChange={ selectedOption => onChange(selectedOption.value) }
            defaultValue={ keyOptions.find(({value}) => value === section.keyString) }
          />
        ) }
      />
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="songForm__chordContainer">
            <Chord chord={field} sectionIndex={sectionIndex} chordIndex={index} register={register} control={control}></Chord>
            <label onClick={() => remove(index)} className="songForm__deleteChordButton">Delete Chord</label>
            <CloneChord control={control} sectionIndex={sectionIndex} chordIndex={index} insert={insert}></CloneChord>
            { index >= 1 && <label onClick={() => swap(index, index - 1)}>Up</label> }
            { index < fields.length - 1 && <label onClick={() => swap(index, index + 1)}>Down</label> }
        </div>
      
    ))}

    <label onClick={() => {
      append({
        chordString: '',
        lyric: '',
      });
      }} className="songForm__addChord">Add Chord</label>

    </>
    
  )
}

const patchData = async (data, id) => {
  const response = await fetch("/api/songs/" + id, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
        "Content-Type": 'application/json'
    }
  })
  if (!response.ok) {
      throw Error("unable to add song");
  }
}

const postData = async (data) => {
  const response = await fetch("/api/songs/", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
        "Content-Type": 'application/json'
    }
  })
  if (!response.ok) {
      throw Error("unable to add song");
  }
}

export default function SongForm2() {
  
  const navigate = useNavigate();
  const { id } = useParams()
  const song = useLoaderData();
  const emptySong = {
    name: '',
    artist: '',
    sections: [{
      name: '',
      keyString: '',
      chords: [{
        chordString: '',
        lyric: '',
      }],
    }]
  }

  const { control, register, reset, formState: { errors }, handleSubmit } = useForm({
    defaultValues: emptySong,
  });
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "sections", // unique name for your Field Array
  });

  useEffect(() => {
    console.log("refresh!")
    reset(song ? songChordToChordString(song) : emptySong, { keepDefaultValues: true })
  }, [song])

  const onSubmit = async (data) => {

    // rebuild data
    parseSong(data);

    if (song) {
      patchData(data, id);
      navigate('/songs/' + id);
    } else {
      postData(data);
      navigate('/songs/list', { replace: true });
    }


  }
   
  return (
    <div className="songForm">
      <form onSubmit={handleSubmit(onSubmit)} className="songForm__form">
        <label>Song Name</label>
        <input {...register("name")} />
        <label>Artist</label>
        <input {...register("artist")} />
        {fields.map((field, index) => (
          // important to include key with field's id
          <div key={field.id} className="songForm__sectionContainer"> 
            <Section section={field} sectionIndex={index} control={control} register={register}></Section>
            <div className="songForm__sectionButtonContainer">
              <label onClick={() => remove(index)}>Delete Section</label>
              <CloneSection control={control} sectionIndex={index} insert={insert}></CloneSection>
              { index >= 1 && <label onClick={() => swap(index, index - 1)}>Move Up</label> }
              { index < fields.length - 1 && <label onClick={() => swap(index, index + 1)}>Move Down</label> }
            </div>
          </div>
        ))}
        <div className="songForm__songButtons">
          <label onClick={() => {
            append({
              name: '',
              keyString: '',
              chords: [{
                chordString: '',
                lyric: '',
              }],
            });
            }} className="songForm__addSection">Add Section</label>
          <input type="submit" className="songForm__submitButton" />
        </div>
      </form>
    </div>
  );
}