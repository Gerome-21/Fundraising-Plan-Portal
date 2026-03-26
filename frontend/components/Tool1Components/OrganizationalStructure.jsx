import React from "react";
import { FiImage, FiRepeat, FiTrash2 } from "react-icons/fi";

const OrganizationalStructure = ({ chart, uploading, handleUploadChart, handleDeleteChart }) => {
  return (
    <section className="mb-8 pt-8 border-t-1 border-gray-400">
      <h3 className="font-bold text-lg mb-4">Organizational Structure</h3>
      <p className="text-sm mb-4">
        Provide a diagram of the current organizational chart, paying particular attention to the resource mobilization team and its relationships with other units. For smaller organizations, provide alternative structures that assume the responsibilities of resource mobilization.
      </p>

      {!chart ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 transition-all hover:border-[#22864D] group">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-[#22864D]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#22864D]/20 transition-all">
              <FiImage className="w-8 h-8 text-[#22864D]" />
            </div>
            <h4 className="font-semibold text-gray-700 mb-2">Upload Organization Chart</h4>
            <p className="text-sm text-gray-500 mb-4">Drag and drop or click to upload (PNG, JPG, JPEG)</p>
            <label className="cursor-pointer">
              <span className="bg-[#22864D] hover:bg-[#22864D]/90 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all inline-block shadow-md hover:shadow-lg">
                {uploading ? 'Uploading...' : 'Choose File'}
              </span>
              <input
                type="file"
                className="hidden"
                accept=".png,.jpg,.jpeg,.pdf"
                onChange={handleUploadChart}
                disabled={uploading}
              />
            </label>
            <div className="mt-4 text-xs text-gray-400">Max file size: 10MB</div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-2xl mb-4 bg-gray-50 rounded-lg overflow-hidden">
              <img
                src={chart.image_url}
                alt="Organizational Chart"
                className="w-full h-auto object-contain max-h-[500px]"
              />
            </div>

            <div className="flex gap-3">
              <label>
                <span className="bg-white text-green-500 hover:bg-gray-200 px-5 py-2.5 rounded-lg text-sm font-medium transition-all inline-flex items-center gap-2 shadow-md hover:shadow-lg cursor-pointer">
                  <FiRepeat />
                  Replace
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept=".png,.jpg,.jpeg,.pdf"
                  onChange={handleUploadChart}
                  disabled={uploading}
                />
              </label>

              <button
                onClick={handleDeleteChart}
                className="bg-gray-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all inline-flex items-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
              >
                <FiTrash2 className="w-4 h-4" />
                Delete
              </button>
            </div>

            {uploading && (
              <div className="mt-4 w-full bg-gray-100 rounded-lg p-3">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <svg className="animate-spin h-4 w-4 text-[#22864D]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Uploading...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default OrganizationalStructure;