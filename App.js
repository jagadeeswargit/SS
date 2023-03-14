import React, { useState } from "react";
import "./App.css";

function App() {
  const [isActive, setIsActive] = useState(true);
  const [response, setisResponse] = useState(false);
  const [value, setValue] = useState("");
  const [user, setUser] = useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const fetchData = async () => {
    try {
      let url =
        `https://mysemanticsearch.azurewebsites.net/api/httptrigger1?name=` +
        value;

      console.log({ url });

      const res = await fetch(url);
      console.log({ res });
      const json = await res.text();

      setUser(json);
      setisResponse(true);
    } catch (err) {
      console.error("err", err);
    }
  };

  const onPressBack = () => {
    setisResponse(false);
    setIsActive(true);
    setValue("");
  };
  return (
    <div>
      <div className="My header">
        <img style={{ margin: 10 }} src={require("./headerLogo.png")} />
      </div>
      {isActive ? (
        <div className="App">
          <div className="mycontent">
            <input type={"file"} ></input>
          </div>
          <div
            style={{
              textAlign: "center",
              marginTop: 20,
            }}
          >
            <button
              onClick={() => setIsActive(false)}
              className="button"
              type="button"
              id="button"
              name="Submit"
            >
              Submit
            </button>
          </div>
        </div>
      ) : (
        <div className="App">
          <button onClick={onPressBack} className="backbutton">
            Back
          </button>

          <textarea
            style={{ fontSize: 20 }}
            name="postContent"
            rows={3}
            cols={60}
            value={value}
            onChange={handleChange}
          />

          <div
            style={{
              textAlign: "center",
              marginTop: 20,
            }}
          >
            <button
              onClick={fetchData}
              className="button"
              type="button"
              id="button"
              name="Submit"
            >
              Submit
            </button>
          </div>
          {response ? <h3 style={{ marginTop: 20 }}>{user}</h3> : null}
          {response ? <h4 style={{ marginTop: 20 }}>{user}</h4> : null}
        </div>
      )}

      <div className="footer">
        <p> ©2023 Aetna Inc.</p>
      </div>
    </div>
  );
}

export default App;
