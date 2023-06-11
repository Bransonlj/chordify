import React, { useState } from 'react'
import { useFieldArray, useForm } from "react-hook-form";
import { Accidentals, Notes, Types, generateChordOptions, generateKeyTypeOptions } from '../../util/chords';
import { redirect, useNavigate } from 'react-router-dom';
import "../../styles/pages/songs/SongForm.css"

const Chord = ({ sectionIndex, chordIndex, register }) => {

  return (
    <>
      <label>Chord</label>
      <select
        {...register(`sections.${sectionIndex}.chords.${chordIndex}.note`)} 
      >
        {generateChordOptions(Notes)}
      </select>
      <select
        {...register(`sections.${sectionIndex}.chords.${chordIndex}.accidental`)} 
      >
        {generateChordOptions(Accidentals)}
      </select>
      <select
        {...register(`sections.${sectionIndex}.chords.${chordIndex}.type`)} 
      >
        {generateChordOptions(Types)}
      </select>
      <div className="songForm__lyric">
        <label>Lyrics</label>
        <input
          {...register(`sections.${sectionIndex}.chords.${chordIndex}.lyric`)} 
        />
      </div>
    </>
  )
}

const Section = ( {sectionIndex, control, register} ) => {

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
        <select {...register(`sections.${sectionIndex}.key.note`)}>
            { generateChordOptions(Notes) }
        </select>
        <select {...register(`sections.${sectionIndex}.key.accidental`)}>
            { generateChordOptions(Accidentals) }
        </select>
        <select {...register(`sections.${sectionIndex}.key.type`)}>
            { generateKeyTypeOptions() }
        </select>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="songForm__chordContainer">
            <Chord sectionIndex={sectionIndex} chordIndex={index} register={register}></Chord>
            <label onClick={() => remove(index)} className="songForm__deleteChordButton">Delete Chord</label>
            { index >= 1 && <label onClick={() => swap(index, index - 1)}>Move Up</label> }
              { index < fields.length - 1 && <label onClick={() => swap(index, index + 1)}>Move Down</label> }
        </div>
      
    ))}
    <label onClick={() => {
      append({ lyrics: "" });
      }} className="songForm__addChord">Add Chord</label>

    </>
    
  )
}

export default function SongForm2() {

  const { control, register, formState: { errors }, handleSubmit } = useForm();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "sections", // unique name for your Field Array
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    console.log(data);
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

     navigate('/songs/list', { replace: true });
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
            <Section sectionIndex={index} control={control} register={register}></Section>
            <div className="songForm__sectionButtonContainer">
              <label onClick={() => remove(index)}>Delete Section</label>
              { index >= 1 && <label onClick={() => swap(index, index - 1)}>Move Up</label> }
              { index < fields.length - 1 && <label onClick={() => swap(index, index + 1)}>Move Down</label> }
            </div>
          </div>
        ))}
        <div className="songForm__songButtons">
          <label onClick={() => {
            append({ sectionName: "", key: {} });
            }} className="songForm__addSection">Add Section</label>
          <input type="submit" className="songForm__submitButton" />
        </div>
      </form>
    </div>
  );
}
