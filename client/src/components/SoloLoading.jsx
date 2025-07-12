import React from 'react'

const SoloLoading = ({ loading, message = "Loading..." }) => {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex flex-col items-center justify-center text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-400 border-t-transparent mb-4" />
      <p className="text-sm font-semibold tracking-wide text-cyan-300">{message}</p>
    </div>
  );
};

export default SoloLoading;

