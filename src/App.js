import './App.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useState } from 'react';
import API from "./utils/API"

function App({...props }) {

  const [html, setHtml] = useState()

  function uploadAdapter(loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          loader.file.then((file) => { 
            var formData = new FormData();
            formData.append('image', file)
            formData.append("destination", "images");

            const config = {
              headers: {
                "content-type": "multipart/form-data"
              }
            };

            API.post('/images', formData, config).then((response)=>{
              console.log(response);
              resolve({
                default: `${response.data.payload.url}`
              });
            }).catch(error=>{
              reject(error);
            })
          
          });
        });
      }
    };
  }
  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  }

  return (
    <div className="App">
        <h2>Using CKEditor 5 build in React</h2>
        <CKEditor
            config={{
              extraPlugins: [uploadPlugin]
            }}
            editor={ClassicEditor}
            onReady={(editor) => {}}
            onBlur={(event, editor) => {}}
            onFocus={(event, editor) => {}}
            onChange={(event, editor) => {
               const html = editor.getData();
               setHtml(html)
            }}
            {...props}
        />
        <h1>
          {html}
        </h1>
    </div>
  );
}

export default App;
