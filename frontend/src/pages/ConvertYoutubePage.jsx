// frontend/src/components/ConvertYoutubePage.js

import React, { useContext, useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import Loader from '@/components/Loader';
import ThemeContext from '@/constants/themes/ThemeContext';
import "../app/globals.css";
import "../css/convert.css"
import getYoutubeTitle from 'get-youtube-title';
import Footer from '@/components/Footer';



export default function ConvertYoutubePage() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [showNavbar, setShowNavbar] = useState(true);
  const [links, setLinks] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [embedHtml, setEmbedHtml] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const [downloadLink, setDownloadLink] = useState('');

  const handleLinksChange = (e) => {
    setLinks(e.target.value);
  };

  // Usage example
  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent form submission
    setLoading(true);


    const videoId = extractVideoId(links);

    if (videoId) {
      setEmbedHtml(
        `<iframe width="520" height="320" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`
      );

      getYoutubeTitle(videoId, function (err, title) {
        setVideoTitle(title);
      })
    } else {
      setEmbedHtml('Invalid URL. Please enter a valid YouTube link.');
      setVideoTitle('');
    }
    setIsSearch(true);
    setLoading(false);
  };
  const extractVideoId = (url) => {
    // Match different YouTube URL formats
    const videoMatch = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (videoMatch) {
      return videoMatch[1]; // Return the matched video ID
    }

    // Handle playlists if needed
    const playlistMatch = url.match(/[&?]list=([a-zA-Z0-9_-]+)/);
    if (playlistMatch) {
      return `videoseries?list=${playlistMatch[1]}`; // Return the playlist format
    }

    return null; // Return null if no match is found
  };



  const handleDownload = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: links }),
      });
      const data = await res.json();
      setDownloadLink(data.download_link);
      const a = document.createElement('a');
      a.href = 'http://localhost:5000/download/'+  data.download_link;
      a.style.display = 'none';
      document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);


    } catch (err) {
      console.error(err);
      setError('Failed to download video');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      {loading && (
        <Loader />
      )}
      <div className={`head ${showNavbar ? "show" : "hide"}`}>
        <Navbar toggleTheme={toggleTheme} theme={theme} />
      </div>
      <div className="convert__body">
        <div className="convert__box">
          <h1 className="convert__box-title">Tải MP3 từ Youtube về máy nhanh nhất</h1>
          <form onSubmit={handleSearch} className="convert__box-link">
            <input
              value={links}
              onChange={handleLinksChange}
              type="text"
              placeholder="Tìm kiếm hoặc nhập link..."
              className="convert__box-input"
            />
            <button type="submit" className="convert__box-submit" disabled={loading} >Tìm kiếm</button>
          </form>
        </div>
        <div className="convert__box-col">
          <div className="convert__box-youtube">
            <div
              dangerouslySetInnerHTML={{ __html: embedHtml }}

            />
            {videoTitle && <h3 style={{ marginTop: '10px' }}>{videoTitle}</h3>}
          </div>
          {isSearch && (<div>
            {/* button success */}
            <button className="convert__box-button" onClick={handleDownload} disabled={loading}>Tải xuống MP3</button>
          </div>)
          }
        </div>


      </div>
      <Footer/>
    </div>
  );
}
