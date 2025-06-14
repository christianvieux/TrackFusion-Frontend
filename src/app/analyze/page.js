// page.js
"use client";
import React, { useState } from "react";
import {
  Button,
  Input,
  Card,
  CardBody,
  Progress,
  Chip,
} from "@nextui-org/react";
import { analyzeAudio } from "../services/audioService";
import MusicNoteIcon from "../components/Icons/MusicNote";
import MetronomeIcon from "../components/Icons/Metronome";

const ALLOWED_AUDIO_TYPES =
  process.env.NEXT_PUBLIC_ALLOWED_AUDIO_TYPES.split(",");

export default function SongAnalyzer() {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [bpmRange, setBpmRange] = useState("50-100");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("audio/")) {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Please select a valid audio file");
      setFile(null);
    }
  };
  const handleBpmRangeChange = (e) => {
    setBpmRange(e.target.value);
  };

  const analyzeSong = async () => {
    setIsAnalyzing(true);
    setError(null);
    setUploadProgress(0);
    setAnalysisProgress(0);
    
    try {
      const results = await analyzeAudio(
        file,
        bpmRange,
        (uploadPct) => setUploadProgress(uploadPct),
        (analysisPct) => setAnalysisProgress(analysisPct)
      );

      setResults(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
      setUploadProgress(0);
      setAnalysisProgress(0);
    }
  };

  const bpmRanges = [
    { value: "50-100", label: "50 to 100" },
    { value: "75-150", label: "75 to 150" },
    { value: "100-200", label: "100 to 200" },
  ];

  return (
    <>
      <div className="mx-auto flex items-start justify-center space-x-4 p-4 text-green">
        <Card>
          <CardBody className="space-y-4">
            <h2 className="text-xl font-semibold">Select Range Of BPM</h2>
            <div className="flex flex-wrap gap-4">
              {bpmRanges.map((range) => (
                <button
                  key={range.label}
                  onClick={() => {
                    setBpmRange(range.value);
                  }}
                  disabled={isAnalyzing}
                  className={`${isAnalyzing ? "opacity-50" : ""}`}
                >
                  <Chip
                    className={`h-full w-full bg-black ${bpmRange == range.value ? "border-green" : ""}`}
                    variant="bordered"
                  >
                    {range.label}
                  </Chip>
                </button>
              ))}
            </div>
            <Input
              type="file"
              accept={ALLOWED_AUDIO_TYPES.join(",")}
              variant="faded"
              onChange={handleFileChange}
              isDisabled={isAnalyzing}
              description={
                file ? file.name : "Select an audio file (mp3, wav, etc.)"
              }
              classNames={{ input: "file:text-green-light" }}
            />

            {error && (
              <Chip color="danger" variant="flat">
                {typeof error === "object"
                  ? "An error occurred during analysis"
                  : error}
              </Chip>
            )}

            {(uploadProgress > 0 || analysisProgress > 0) && (
              <div className="space-y-4">
                {uploadProgress > 0 && (
                  <Progress
                    value={uploadProgress}
                    color="secondary"
                    label={uploadProgress === 100 ? "Waiting for server..." : "Sending to server..."}
                    className="max-w-md"
                  />
                )}
                {analysisProgress > 0 && (
                  <Progress
                    value={analysisProgress}
                    color="primary"
                    label={analysisProgress === 100 ? "analysis done!" : "Analyzing..."}
                    className="max-w-md"
                  />
                )}
              </div>
            )}

            <Button
              color="primary"
              onClick={analyzeSong}
              isLoading={isAnalyzing}
              isDisabled={!file || isAnalyzing}
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Song"}
            </Button>
          </CardBody>
        </Card>

        {results && (
          <Card className="max-w-xs transition-all duration-300 hover:shadow-lg">
            <CardBody className="p-6">
              <h2 className="text-gray-800 mb-6 text-xl font-bold">
                Analysis Results
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="bg-gray-50 flex items-center space-x-3 rounded-lg p-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <MetronomeIcon className="size-10 text-green" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">BPM</p>
                    <p className="text-gray-800 font-semibold">{results.bpm}</p>
                  </div>
                </div>

                <div className="bg-gray-50 flex items-center space-x-3 rounded-lg p-3">
                  <div className="bg-purple-100 rounded-full p-2">
                    <MusicNoteIcon className="size-10 text-green" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Key</p>
                    <p className="text-gray-800 font-semibold">{results.key}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg text-center">
                <p className="text-gray-600 text-wrap">
                  ✨ More analysis features coming sometime in the future! ✨
                </p>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </>
  );
}
