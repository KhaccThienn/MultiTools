<<<<<<< HEAD
// pages/AudioEditorPage.js

import React, { useState } from 'react';
=======
import React from "react";
>>>>>>> 289da032e3cf9159025361769e31291711dea3f8
import "../app/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { AudioProvider } from '@/context/AudioContext';
import MenuAudioEditor from '@/components/MenuAudioEditor';
import AudioDisplay from '@/components/AudioDisplay';
import AudioUpload from '@/components/AudioUpload';
import FooterAudioEditor from '@/components/FooterAudioEditor';
import Head from 'next/head'; // Import Head from 'next/head'

export default function AudioEditorPage({ data }) { // You can receive props if needed
    const [mode, setMode] = useState("");

    const handleMode = (mode) => {
        setMode(mode);
        console.log("Mode selected:", mode);
    }

<<<<<<< HEAD
    return (
        <AudioProvider>
            <Head>
                <title>MultiTools | Công cụ chỉnh sửa đa năng</title>
            </Head>
            <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
                {/* Menu + Display */}
                <div style={{ display: "flex", flex: 1 }}>
                    {/* Menu */}
                    <div style={{ width: "22em", backgroundColor: "#2e2e2e" }}>
                        <MenuAudioEditor onMode={handleMode} />
                    </div>
                    {/* Display */}
                    <div style={{ flex: 1, backgroundColor: "#2e2e2e", position: "relative", overflow: "hidden" }}>
                        <AudioDisplay mode={mode} />
                    </div>
                </div>
                <div style={{ display: "flex", height: "10vh", backgroundColor: "#292c31" }}>
                    <AudioUpload />
                    <FooterAudioEditor />
                </div>
            </div>
        </AudioProvider>
    );
}

// Optional: If you need to fetch data at build time
export async function getStaticProps() {
  // Fetch data here
  const data = await fetchData();

  return {
    props: {
      data,
    },
  };
}

async function fetchData() {
  // Replace with your data fetching logic
  return { /* ... */ };
=======
export default function AudioEditorPage() {
  return (
    <div>
      <title>MultiTools | Công cụ chuyển đổi định dạng</title>
      <h1>Trình chỉnh sửa âm thanh</h1>
      <p>Trang này sẽ chứa trình chỉnh sửa âm thanh.</p>
    </div>
  );
>>>>>>> 289da032e3cf9159025361769e31291711dea3f8
}
