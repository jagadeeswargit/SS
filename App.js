<!DOCTYPE html>

<html lang="en">
  <head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
    <title>Ask Rx</title>
  </head>
  <body>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"></script>
    <div id="root"></div>
  </body>
</html>


import * as pdfjsLib from "pdfjs-dist";
import React, { useState } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import "./App.css";
const BASE64_MARKER = ";base64,";
let sliderTimer = null;
let number = 1;
function App() {
  const [isActive, setIsActive] = useState(true);
  const [response, setisResponse] = useState(false);
  const [value, setValue] = useState("");
  const [user, setUser] = useState("");
  const [pdfFileError, setPdfFileError] = useState("");
  const [progressMsg, serPregressMsg] = useState("");
  const [pagesText, setTagesText] = useState([]);
  const [showOtpTime, setShowOtpTime] = React.useState(1);
  const [progressBar, setShowProgessbar] = React.useState(false);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const postData = async () => {
    try {
      startTimer();
      setShowProgessbar(true);
      serPregressMsg("Ask Rx is getting Trained on Prescription.");
      let url =
        `https://mysemanticsearch.azurewebsites.net/api/httptrigger1?name=test&pdfData=` +
        pagesText;

      const res = await fetch(url);
      console.log(res.status);
      if (res.status == 200) {
        const json = await res.text();
        setIsActive(false);
      } else {
        setPdfFileError("");
      }
      setShowProgessbar(false);
    } catch (err) {
      console.error("err", err);
      setShowProgessbar(false);
      clearInterval(sliderTimer);
    }
  };
  const fetchData = async () => {
    try {
      startTimer();
      setShowProgessbar(true);
      serPregressMsg("Ask Rx is retrieving Answer");
      let url =
        `https://mysemanticsearch.azurewebsites.net/api/httptrigger1?name=` +
        value +
        `&pdfData=test`;
      console.log({ url });
      const res = await fetch(url);
      const json = await res.text();
      setIsActive(false);
      setUser(json);
      setisResponse(true);
      setShowProgessbar(false);
    } catch (err) {
      console.error("err", err);
    }
  };
  // const psfReader = () =>{
  //   new PdfReader().parseFileItems("test/sample.pdf", (err, item) => {
  //     if (err) console.error("error:", err);
  //     else if (!item) console.warn("end of file");
  //     else if (item.text) console.log(item.text);
  //   });
  // }

  const onPressBack = () => {
    setisResponse(false);
    setIsActive(true);
    setValue("");
  };
  // onchange event
  const fileType = ["application/pdf"];
  const handlePdfFileChange = (e) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileType.includes(selectedFile.type)) {
        let reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = (e) => {
          convertDataURIToBinary(e.target.result);
        };
      } else {
        setPdfFileError("Please select valid pdf file");
      }
    } else {
      console.log("select your file");
    }
  };
  const convertDataURIToBinary = (dataURI) => {
    let base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    let base64 = dataURI.substring(base64Index);
    let raw = window.atob(base64);
    let rawLength = raw.length;
    let array = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    pdfAsArray(array);
  };

  const pdfAsArray = (pdfAsArray) => {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

    pdfjsLib.getDocument(pdfAsArray).promise.then(
      function (pdf) {
        var pdfDocument = pdf;
        var pagesPromises = [];

        for (var i = 0; i < pdf._pdfInfo.numPages; i++) {
          (function (pageNumber) {
            pagesPromises.push(getPageText(pageNumber, pdfDocument));
          })(i + 1);
        }

        // Execute all the promises
        Promise.all(pagesPromises).then(function (pagesText) {
          setTagesText(pagesText);
          setPdfFileError("");

          //for (var pageNum = 0; pageNum < pagesText.length; pageNum++) {
          //  console.log("___33333____________", pagesText[pageNum]);
          //}
        });
      },
      function (reason) {
        // PDF loading error
        console.error(reason);
      }
    );
  };
  const getPageText = (pageNum, PDFDocumentInstance) => {
    // Return a Promise that is solved once the text of the page is retrieven
    return new Promise(function (resolve, reject) {
      PDFDocumentInstance.getPage(pageNum).then(function (pdfPage) {
        // The main trick to obtain the text of the PDF page, use the getTextContent method
        pdfPage.getTextContent().then(function (textContent) {
          let textItems = textContent.items;
          let finalString = "";

          // Concatenate the string of the item to the final string
          for (let i = 0; i < textItems.length; i++) {
            let item = textItems[i];

            finalString += item.str + " ";
          }

          // Solve promise with the text retrieven from the page
          resolve(finalString);
        });
      });
    });
  };
  const startTimer = () => {
    sliderTimer = setInterval(() => {
      try {
        let aa = number++;
        console.log({ aa });
        setShowOtpTime(aa);
        if (aa == 100) {
          clearInterval(sliderTimer);
        }
      } catch (error) {
        console.log("error  - - - " + error);
      }
    }, 1000);
  };
  return (
    <div>
      <div className="My header">
        <img style={{ margin: 10 }} src={require("./headerLogo.png")} />
      </div>
      {progressBar ? (
        <ProgressBar
          style={{ width: "70%", marginLeft: 200 }}
          animated
          now={100}
          label={progressMsg}
        />
      ) : null}
      ;
      {isActive ? (
        <div className="App">
          <div>
            <h3 style={{ marginBottom: 20 }}>PLEASE UPLOAD FILE</h3>
            <input type={"file"} onChange={handlePdfFileChange}></input>
            {pdfFileError && <div className="error-msg">{pdfFileError}</div>}
          </div>

          <div
            style={{
              textAlign: "center",
              marginTop: 20,
            }}
          >
            <button
              onClick={postData}
              // onClick={startTimer}
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

          <h1 style={{ color: "#5a2e6f", marginBottom: 20 }}>sdfdsfdf</h1>
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
      <div
        style={{ position: "absolute", bottom: 0, left: 0 }}
        className="footer"
      >
        <p> ©2023 Aetna Inc.</p>
      </div>
    </div>
  );
}

export default App;
