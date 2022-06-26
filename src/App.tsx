import { useState } from 'react'
import { flushSync } from 'react-dom';
import './App.css'
import * as SimpleVal from './SimpleVal';

const valSchema: {[Key in StateKeys]?: SimpleVal.StringSchema} = {
  first: SimpleVal.string().isPhone(),
  second: SimpleVal.string().max(5),
}
const initialState = {
  first: '',
  second: '',
  third: '',
}

const initialTouched = Object.fromEntries(Object.entries(initialState).map(([name, value]) => [name, false]));
  
type StateKeys = keyof typeof initialState;

const validateSchema = (valObj: {[Key in StateKeys]: string}): {[key in StateKeys]: string} => {
  return Object.fromEntries(Object.entries(valObj).map(([name, value]) => [name, valSchema[name as StateKeys]?.validate(value)])) as {[key in StateKeys]: string};
}

function App() {
  const [formValues, setForm] = useState(initialState);
  const [errors, setErrors] = useState(initialState);
  const [touchedFields, setTouched] = useState(initialTouched);

  const handleChange = (name:  StateKeys) => {
    return (event: { target: HTMLInputElement }) => {
      if (touchedFields[name]) {
        const validationResult = valSchema[name]?.validate(event.target.value);
        if (validationResult) setErrors({ ...errors, [name]: validationResult });
      }
      setForm({ ...formValues, [name]: event.target.value });
    }
  };
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const validationResult = validateSchema(formValues)
    setErrors(validationResult);
  }
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const name = event.target.name as StateKeys;
    setTouched((state) => { return { ...state, [name]: true } });
    const validationResult = valSchema[name]?.validate(event.target.value);
    if (validationResult) setErrors({ ...errors, [name]: validationResult });
  }


  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <label>
          Телефон:&nbsp;
          <input type='text' name='first' value={formValues.first} onChange={handleChange('first')} onBlur={handleBlur}/>
          {errors.first && <span>{errors.first}</span>}
        </label>
        <label>
          Something:&nbsp;
          <input type='text' name='second' value={formValues.second} onChange={handleChange('second')} onBlur={handleBlur}/>
          {errors.second && <span>{errors.second}</span>}
        </label>
        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}

export default App
