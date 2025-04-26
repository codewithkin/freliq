import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Input } from "../ui/input";

function FileUploader({
  onFileSelected,
}: {
  onFileSelected: (file: File) => void;
}) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelected(acceptedFiles[0]);
      }
    },
    [onFileSelected],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-300 p-6 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition"
    >
      <Input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the file here...</p>
      ) : (
        <p>Drag and drop a file here, or click to select</p>
      )}
    </div>
  );
}

export default FileUploader;
