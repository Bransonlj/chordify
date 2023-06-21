import React, { useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import "../../styles/pages/songs/SongForm.css"
import Select, {components} from 'react-select'
import AsyncSelect from 'react-select/async'
import { Chord } from '../../util/classes/Chord';

// ----------- constants -----------

const chordOptions = Chord.generateAllChordOptions();
const keyOptions = Chord.generateAllKeyOptions();

const emptySong = {
  name: '',
  artist: '',
  capo: 0,
  sections: [{
    name: '',
    keyString: '',
    chords: [{
      chordString: '',
      lyric: '',
    }],
  }]
};

const emptySection = {
  name: '',
    keyString: '',
    chords: [{
      chordString: '',
      lyric: '',
    }],
}

const emptyChord = {
  chordString: '',
  lyric: '',
};

// ---------- Component Helper Functions ------------

const isDefaultChord = (chord) => {
  return emptyChord.chordString === chord.chordString && emptyChord.lyric === chord.lyric;

}

const isDefaultSection = (section) => {
  let isEmptyChords = true;
  for (const chord of section.chords) {
    if (!isDefaultChord(chord)) {
      isEmptyChords = false;
    }
  }

  return emptySection.name === section.name && emptySection.keyString === section.keyString && isEmptyChords;
}

const handleDeleteChord = (remove, index, chord) => {
  if (isDefaultChord(chord)) {
    remove(index);
  } else if (window.confirm("Delete chord?")) {
    remove(index);
  }
}

const handleDeleteSection = (remove, index, section) => {
  if (isDefaultSection(section)) {
    remove(index);
  } else if (window.confirm("Delete section?")) {
    remove(index);
  }
}

// ---------- Submission helper functions ----------

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

const filterColors = (inputValue) => {
  return chordOptions.filter((i) =>
    i.label.toLowerCase().startsWith(inputValue.toLowerCase())
  );
};

const loadOptions = (inputValue, callback) => {
  setTimeout(() => {
    callback(filterColors(inputValue));
  }, 1000);
};

// -------------- COMPONENTS: DeleteChord, DeleteSection, CloneChord, CloneSection, ChordForm, SectionForm, SongForm ---------------

function SelectChord({ onChange, chord }) {
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  return (
  <AsyncSelect 
    cacheOptions 
    loadOptions={loadOptions} 
    onChange={ selectedOption => onChange(selectedOption.value) }
    defaultValue={ chordOptions.find(({value}) => value === chord.chordString) }
    placeholder="Enter..."
    defaultOptions 
    onInputChange={(value) => {
      if (value) {
        setMenuIsOpen(true);
      } else {
        setMenuIsOpen(false);
      }
    }}
    menuIsOpen={menuIsOpen}
  />
  )
}

function DeleteChord({ control, remove, sectionIndex, chordIndex }) {
  const chordValue = useWatch({
    control, 
    name: `sections.${sectionIndex}.chords.${chordIndex}`
  })

  return (
    <label onClick={ () => handleDeleteChord(remove, chordIndex, chordValue) }>Delete Chord</label>
  )
}

function DeleteSection({ control, remove, sectionIndex }) {
  const sectionValue = useWatch({
    control,
    name: `sections.${sectionIndex}`
  })

  return (
    <label onClick={ () => handleDeleteSection(remove, sectionIndex, sectionValue) }>Delete Section</label>
  )
}

function CloneChord({ control, insert, sectionIndex, chordIndex }) {
  const chordValue = useWatch({
    control,
    name: `sections.${sectionIndex}.chords.${chordIndex}`
  });

  return (
    <label onClick={() => insert(chordIndex + 1, chordValue)}>Copy</label>
  )
}

function CloneSection({ control, insert, sectionIndex }) {
  const sectionValue = useWatch({
    control,
    name: `sections.${sectionIndex}`
  });

  return (
    <label onClick={() => insert(sectionIndex + 1, sectionValue)}>Copy</label>
  )
}

function ChordForm ({ chord, sectionIndex, chordIndex, register, control }) {
  return (
    <>
      <label>Chord</label>
      <Controller
        name={ `sections.${sectionIndex}.chords.${chordIndex}.chordString` }
        control={ control }

        render={ ({ field: { onChange } }) => (
          <SelectChord onChange={onChange} chord={chord}/>
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

function SectionForm( { section, sectionIndex, control, register } ) {

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

      { fields.map((field, index) => (
        <div key={field.id} className="songForm__chordContainer">
            <ChordForm chord={field} sectionIndex={sectionIndex} chordIndex={index} register={register} control={control} />
            <DeleteChord 
              className="songForm__deleteChordButton" 
              control={control} remove={remove} 
              sectionIndex={sectionIndex} 
              chordIndex={index}
            />
            <CloneChord control={control} sectionIndex={sectionIndex} chordIndex={index} insert={insert}></CloneChord>
            { index >= 1 && <label onClick={() => swap(index, index - 1)}>Up</label> }
            { index < fields.length - 1 && <label onClick={() => swap(index, index + 1)}>Down</label> }
        </div>
      
      )) }

      <label onClick={ () => append(emptyChord) } className="songForm__addChord">Add Chord</label>
    </>
    
  )
}

export default function SongForm() {
  
  const navigate = useNavigate();
  const { id } = useParams()
  const song = useLoaderData();

  const { control, register, reset, formState: { errors }, handleSubmit } = useForm({
    defaultValues: emptySong,
  });
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "sections", // unique name for your Field Array
  });

  useEffect(() => {
    console.log("refresh!")
    reset(song ? song : emptySong, { keepDefaultValues: true })
  }, [song])

  const onSubmit = async (data) => {

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
        <label>Capo</label>
        <input {...register("capo")} type='number' />
        {fields.map((field, index) => (
          // important to include key with field's id
          <div key={field.id} className="songForm__sectionContainer"> 
            <SectionForm section={field} sectionIndex={index} control={control} register={register} />
            <div className="songForm__sectionButtonContainer">
              <DeleteSection 
                control={control}
                remove={remove}
                sectionIndex={index}
              />
              <CloneSection control={control} sectionIndex={index} insert={insert}></CloneSection>
              { index >= 1 && <label onClick={() => swap(index, index - 1)}>Move Up</label> }
              { index < fields.length - 1 && <label onClick={() => swap(index, index + 1)}>Move Down</label> }
            </div>
          </div>
        ))}
        <div className="songForm__songButtons">
          <label 
            onClick={ () => append(emptySection) } 
            className="songForm__addSection"
          >Add Section</label>
          <input type="submit" className="songForm__submitButton" />
        </div>
      </form>
    </div>
  );
}
