import{ useState } from 'react';
import Dropzone, { DropzoneState } from 'react-dropzone';
import "@/styles/Upload.css";
import { Button } from '../ui/button';

function CsvUploadPage() {
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);

  const handleDrop = (accepted: File[]) => {
    setAcceptedFiles(accepted);
  };

  return (
    <div className="content-holder">
      <h1>Upload CSV File</h1>
      <Dropzone
        accept={{ 'text/csv': ['.csv'] }}
        onDrop={handleDrop}
      >
        {({ getRootProps, getInputProps }: DropzoneState) => (
          <div {...getRootProps()} className="dropoff">
            <input {...getInputProps()} type='file'/>
            <p>Drag 'n' drop some files here, or click to select files</p>
          </div>
        )}
      </Dropzone>

      {(acceptedFiles.length > 0) && <div className='flex flex-col items-center'>
        <div className='files-holder'>
            <h2 className='text-center'>Accepted Files</h2>
            <ul className='list-dot'>
              {acceptedFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
        </div>
          <Button className='max-w-sm'>Upload Chosen CSV files</Button>
      </div>}
    </div>
  );
}

export default CsvUploadPage;
