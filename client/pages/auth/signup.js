import axios from "axios";
import { useState } from "react";

export default ()=> {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const submit = async event => {
    event.preventDefault();

    try {
      await axios.post("/api/users/signup", {email, password});
      setErrors([])
    } catch(err) {
      setErrors(err.response.data.errors)
    }
  }
  return <div>
    <form>
      <div className="form-group">
        <label>Email</label>
        <input className="form-control" value={email} onChange={e=>setEmail(e.target.value)}/>
      </div>
      <div className="form-group">
        <label>Password</label>
        <input className="form-control" value={password} onChange={e=>setPassword(e.target.value)}/>
      </div>
      {errors.length > 0 && <div className="alert alert-danger">
        <h4>Ooops....</h4>
        <ul>
          {errors.map((error, index) => <li key={index}>{error.message}</li>)}
        </ul>
      </div>}
      <button className="btn btn-primary" type="submit" onClick={submit}>Submit</button>
    </form>
  </div>
}