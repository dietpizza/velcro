import { useHistory } from "react-router-dom";

const NewDownload = ({ aria2 }) => {
  const history = useHistory();
  return (
    <div className="flex flex-col flex-grow h-0 overflow-y-auto text-sm text-gray-600">
      <div className="flex flex-col items-center w-full px-4 py-3 border-b border-gray-200 md:py-2 md:flex-row">
        <p className="w-full md:w-2/5">URI:</p>
        <input
          type="url"
          className="w-full p-2 border border-gray-300 outline-none resize-none md:py-1 focus:border-blue-300"
          placeholder="eg. https://google.com"
        />
      </div>
      <div className="flex flex-col items-center w-full px-4 py-3 border-b border-gray-200 md:py-2 md:flex-row">
        <p className="w-full md:w-2/5">Segments:</p>
        <input
          type="number"
          className="w-full p-2 border border-gray-300 outline-none resize-none md:py-1 focus:border-blue-300"
          placeholder="default: 4"
        />
      </div>
      <div className="flex flex-col items-center w-full px-4 py-3 border-b border-gray-200 md:py-2 md:flex-row">
        <p className="w-full md:w-2/5">Save Location:</p>
        <input
          type="url"
          className="w-full p-2 border border-gray-300 outline-none resize-none md:py-1 focus:border-blue-300"
          placeholder="default: /home/rohan/dl/aria2"
        />
      </div>
      <div className="flex flex-col items-center w-full px-4 py-3 border-b border-gray-200 md:py-2 md:flex-row">
        <p className="w-full md:w-2/5">Referer:</p>
        <input
          type="url"
          className="w-full p-2 border border-gray-300 outline-none resize-none md:py-1 focus:border-blue-300"
          placeholder="eg. https://google.com"
        />
      </div>
      <div className="flex flex-col items-center w-full px-4 py-3 border-b border-gray-200 md:py-2 md:flex-row">
        <p className="w-full md:w-2/5">Force Save:</p>
        <input
          className="w-full p-2 border border-gray-300 outline-none resize-none md:py-1 focus:border-blue-300"
          placeholder="default: True"
        />
      </div>
      <div className="flex justify-between p-4 py-2 md:justify-end space-x-2">
        <button
          onClick={() => {
            if (window.confirm("Discard Data?")) history.goBack();
          }}
          className="px-4 py-2 font-bold text-blue-600 bg-blue-200 border border-blue-500 focus:outline-none"
        >
          Discard
        </button>
        <button className="px-4 py-2 font-bold text-green-600 bg-green-200 border border-green-500 focus:outline-none">
          Download
        </button>
      </div>
    </div>
  );
};
export default NewDownload;
