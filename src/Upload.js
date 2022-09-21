import React, { useState } from "react";
import aws from "aws-sdk";

// installed using npm install buffer --save
window.Buffer = window.Buffer || require("buffer").Buffer;

// a React functional component, used to create a simple upload input and button

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [image, setImage] = useState(null);

  // the configuration information is fetched from the .env file

  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadFile = async (file) => {
    const region = process.env.REACT_APP_REGION;
    const accessKeyId = process.env.REACT_APP_ACCESS;
    const secretAccessKey = process.env.REACT_APP_SECRET;
    const signatureVersion = "v4";

    const s3 = new aws.S3({
      region,
      accessKeyId,
      secretAccessKey,
      signatureVersion,
    });

    const bucketName = process.env.REACT_APP_BUCKET_NAME;
    const params = {
      Bucket: bucketName,
      Key: file.name,
      Expires: 60,
    };

    const uploadURL = await s3.getSignedUrlPromise("putObject", params);
    console.log(uploadURL);

    await fetch(uploadURL, {
      method: "PUT",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: file,
    }).then((response) => {
      setImage(response.url.split("?")[0]);
    });
  };
  return (
    <div>
      <div>React S3 File Upload</div>
      <input
        type="file"
        onChange={(event) => {
          handleFileInput(event);
        }}
      />
      <br></br>
      <button onClick={() => uploadFile(selectedFile)}> Upload to S3</button>
      <img src={image} />
    </div>
  );
};

export default Upload;
