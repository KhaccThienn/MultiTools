// import Head from "next/head";
// import "../app/globals.css";
// import { useState, useEffect } from "react";
// import Crop from "@/functions/Crop";
// import Resize from "@/functions/Resize";
// import RemoveBackground from "@/functions/RemoveBackground";
// import ButtonSelection from "@/components/ButtonSelection";

// export default function EditImage() {
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [top, setTop] = useState(0);
//   const [left, setLeft] = useState(0);
//   const [width, setWidth] = useState(0);
//   const [height, setHeight] = useState(0);

// // Hàm xử lý khi người dùng chọn ảnh
// const handleFileChange = (event) => {
//   if (event.target.files && event.target.files[0]) {
//     const file = event.target.files[0];
//     const imageUrl = URL.createObjectURL(file);

//     // Xóa URL cũ nếu có để tránh rò rỉ bộ nhớ
//     if (selectedImage) {
//       URL.revokeObjectURL(selectedImage);
//     }

//     setSelectedImage(imageUrl);

//     // Lưu ảnh vào localStorage
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onloadend = () => {
//       localStorage.setItem("selectedImage", reader.result);
//     };
//   }
// };

//   // Hàm để xóa ảnh hiện tại
//   const handleRemoveImage = () => {
//     setSelectedImage(null);
//     localStorage.removeItem("selectedImage");
//   };

//   // Sử dụng useEffect để lấy tọa độ của ảnh sau khi ảnh đã được render
//   useEffect(() => {
//     if (selectedImage) {
//       const imgElement = document.getElementById("myImage");
//       if (imgElement) {
//         const rect = imgElement.getBoundingClientRect();
//         setTop(rect.top);
//         setLeft(rect.left);
//         setWidth(rect.width);
//         setHeight(rect.height);
//       }
//     }
//   }, [selectedImage]); // Chạy useEffect khi selectedImage thay đổi

//   // Sử dụng useEffect để tải ảnh từ localStorage khi trang load lại
//   useEffect(() => {
//     const savedImage = localStorage.getItem("selectedImage");
//     if (savedImage) {
//       setSelectedImage(savedImage);
//     }
//   }, [selectedImage]);

//   const [activeComponent, setActiveComponent] = useState(null);
//   const [activeGroup, setActiveGroup] = useState(0); // Quản lý nhóm hiện tại đang hiển thị
//   const [searchTerm, setSearchTerm] = useState(""); // Quản lý từ khóa tìm kiếm

//   // Tạo mảng chứa các nhóm, mỗi nhóm chứa các chức năng
//   const groups = [
//     [
//       { label: "Crop", onClick: () => setActiveComponent("crop") },
//       { label: "Resize", onClick: () => setActiveComponent("resize") },
//       {
//         label: "Remove Background",
//         onClick: () => setActiveComponent("removebg"),
//       },
//       { label: "Rotate", onClick: () => setActiveComponent("rotate") },
//       { label: "Flip", onClick: () => setActiveComponent("flip") },
//       {
//         label: "Adjust Brightness",
//         onClick: () => setActiveComponent("brightness"),
//       },
//       {
//         label: "Adjust Contrast",
//         onClick: () => setActiveComponent("contrast"),
//       },
//       {
//         label: "Adjust Saturation",
//         onClick: () => setActiveComponent("saturation"),
//       },
//     ],
//     [
//       { label: "Sharpen", onClick: () => setActiveComponent("sharpen") },
//       { label: "Blur", onClick: () => setActiveComponent("blur") },
//       { label: "Grayscale", onClick: () => setActiveComponent("grayscale") },
//       { label: "Sepia", onClick: () => setActiveComponent("sepia") },
//       { label: "Invert Colors", onClick: () => setActiveComponent("invert") },
//       { label: "Add Text", onClick: () => setActiveComponent("text") },
//       { label: "Add Sticker", onClick: () => setActiveComponent("sticker") },
//       { label: "Add Frame", onClick: () => setActiveComponent("frame") },
//     ],
//   ];

//   // Lọc các button theo từ khóa tìm kiếm
//   const filteredButtons = groups[activeGroup].filter((func) =>
//     func.label.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Hàm để render component tương ứng
//   const renderComponent = () => {
//     switch (activeComponent) {
//       case "crop":
//         return <Crop
//         image={selectedImage} // Truyền ảnh xuống dưới dạng prop
//         top={top}
//         left={left}
//         width={width}
//         height={height}
//       />;
//       case "resize":
//         return <Resize />;
//       case "removebg":
//         return <RemoveBackground />;
//       case "rotate":
//         return <div>Rotate Component</div>;
//       case "flip":
//         return <div>Flip Component</div>;
//       case "brightness":
//         return <div>Brightness Component</div>;
//       case "contrast":
//         return <div>Contrast Component</div>;
//       case "saturation":
//         return <div>Saturation Component</div>;
//       case "sharpen":
//         return <div>Sharpen Component</div>;
//       case "blur":
//         return <div>Blur Component</div>;
//       case "grayscale":
//         return <div>Grayscale Component</div>;
//       case "sepia":
//         return <div>Sepia Component</div>;
//       case "invert":
//         return <div>Invert Colors Component</div>;
//       case "text":
//         return <div>Add Text Component</div>;
//       case "sticker":
//         return <div>Add Sticker Component</div>;
//       case "frame":
//         return <div>Add Frame Component</div>;
//       default:
//         return null;
//     }
//   };

//   return (
//     <>
//       <Head>
//         <title>Chỉnh sửa hình ảnh | MultiTools</title>
//         <meta
//           name="description"
//           content="Trang chỉnh sửa hình ảnh của MultiTools với các công cụ đa dạng và mạnh mẽ."
//         />
//       </Head>
//       <div
//         style={{ height: "100vh", display: "flex", flexDirection: "column" }}
//       >
//         <div
//           style={{
//             height: "80px",
//             backgroundColor: "black",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             padding: "0 20px",
//           }}
//         >
//           <button
//             onClick={handleRemoveImage}
//             style={{
//               padding: "5px 10px",
//               marginRight: "10px",
//               borderRadius: "5px",
//               backgroundColor: "red",
//               color: "white",
//             }}
//           >
//             Xóa ảnh
//           </button>

//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleFileChange}
//             style={{
//               padding: "5px 10px",
//               borderRadius: "5px",
//               backgroundColor: "green",
//               color: "white",
//             }}
//             id="fileInput"
//           />

//           <span
//             style={{
//               color: "white",
//               marginLeft: "10px",
//             }}
//           >
//             {selectedImage && selectedImage.name ? selectedImage.name : ""}
//           </span>
//         </div>
//         <div style={{ flexGrow: 1, display: "flex" }}>
//           <div
//             style={{
//               width: "80%",
//               backgroundColor: "#333",
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             {selectedImage ? (
//               <img
//                 src={selectedImage}
//                 alt="Selected"
//                 style={{ maxWidth: "100%", height: "auto" }}
//                 id="myImage" // Thêm id cho hình ảnh
//               />
//             ) : (
//               <div style={{ height: "100%", color:'white', display:'flex', alignItems:'center' }}>

//                 Hãy thực hiện việc thêm ảnh
//               </div>
//             )}
//           </div>
//           {selectedImage && ( // Chỉ hiển thị menu chức năng khi có ảnh
//           <div
//             style={{
//               backgroundColor: "#ccc",
//               width: "20%",
//               display: "flex",
//               flexDirection: "column",
//               padding: "20px",
//             }}
//           >
//             {/* Thanh tìm kiếm */}
//             <input
//               type="text"
//               placeholder="Tìm kiếm chức năng..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               style={{
//                 padding: "5px",
//                 marginBottom: "10px",
//                 borderRadius: "5px",
//                 border: "1px solid #aaa",
//               }}
//             />

//             {/* Nếu không có component nào được chọn, hiển thị các button theo nhóm */}
//             {activeComponent === null ? (
//               <>
//                 {/* Hiển thị các button trong nhóm hiện tại */}
//                 <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
//                   {filteredButtons.length > 0 ? (
//                     filteredButtons.map((func, index) => (
//                       <ButtonSelection
//                         key={index}
//                         onClick={func.onClick}
//                         label={func.label}
//                       />
//                     ))
//                   ) : (
//                     <p>Không có chức năng phù hợp.</p>
//                   )}
//                 </div>

//                 {/* Nút chuyển đổi giữa các nhóm chức năng */}
//                 <div style={{ marginTop: "10px" }}>
//                   {activeGroup > 0 && (
//                     <button
//                       onClick={() => setActiveGroup(activeGroup - 1)}
//                       style={{ marginRight: "10px" }}
//                     >
//                       Previous Group
//                     </button>
//                   )}
//                   {activeGroup < groups.length - 1 && (
//                     <button onClick={() => setActiveGroup(activeGroup + 1)}>
//                       Next Group
//                     </button>
//                   )}
//                 </div>
//               </>
//             ) : (
//               <>
//                 {/* Hiển thị component tương ứng */}
//                 <div style={{ marginTop: "20px" }}>{renderComponent()}</div>

//                 {/* Nút quay lại để chọn lại các chức năng */}
//                 <button
//                   onClick={() => setActiveComponent(null)}
//                   style={{ marginTop: "20px" }}
//                 >
//                   Return
//                 </button>
//               </>
//             )}
//           </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

import Head from "next/head";
import "../app/globals.css";
import { useState, useEffect } from "react";
import Crop from "@/functions/Crop";
import Resize from "@/functions/Resize";
import RemoveBackground from "@/functions/RemoveBackground";
import ButtonSelection from "@/components/ButtonSelection";

export default function EditImage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [cropData, setCropData] = useState(null);

  // Hàm xử lý khi người dùng chọn ảnh
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);

      // Xóa URL cũ nếu có để tránh rò rỉ bộ nhớ
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }

      setSelectedImage(imageUrl);

      // Lưu ảnh vào localStorage
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        localStorage.setItem("selectedImage", reader.result);
      };
    }
  };

  // Hàm để xóa ảnh hiện tại
  const handleRemoveImage = () => {
    setSelectedImage(null);
    localStorage.removeItem("selectedImage");
  };

  // Sử dụng useEffect để lấy tọa độ của ảnh sau khi ảnh đã được render
  useEffect(() => {
    if (selectedImage) {
      const imgElement = document.getElementById("myImage");
      if (imgElement) {
        const rect = imgElement.getBoundingClientRect();
        setTop(rect.top);
        setLeft(rect.left);
        setWidth(rect.width);
        setHeight(rect.height);
      }
    }
  }, [selectedImage]); // Chạy useEffect khi selectedImage thay đổi

  // Sử dụng useEffect để tải ảnh từ localStorage khi trang load lại
  useEffect(() => {
    const savedImage = localStorage.getItem("selectedImage");
    if (savedImage) {
      setSelectedImage(savedImage);
    }
  }, [selectedImage]);


  // Hàm để xử lý các nút chức năng
  const handleCrop = (data) => {
    setCropData(data);
  };

  const handleUndo = (data) => {
    setCropData(data); // Set dữ liệu ảnh sau khi undo
  };

  const handleRedo = (data) => {
    setCropData(data); // Set dữ liệu ảnh sau khi redo
  };

  const handleSave = (data) => {
    console.log("Saved Data:", data); // Lưu dữ liệu ảnh sau khi crop
    // Thêm logic lưu vào server hoặc localStorage ở đây
  };

  const [activeComponent, setActiveComponent] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Quản lý từ khóa tìm kiếm

  // Tạo mảng chứa tất cả các chức năng
  const functions = [
    { label: "Crop", onClick: () => setActiveComponent("crop") },
    { label: "Resize", onClick: () => setActiveComponent("resize") },
    {
      label: "Remove Background",
      onClick: () => setActiveComponent("removebg"),
    },
    { label: "Rotate", onClick: () => setActiveComponent("rotate") },
    { label: "Flip", onClick: () => setActiveComponent("flip") },
    {
      label: "Adjust Brightness",
      onClick: () => setActiveComponent("brightness"),
    },
    { label: "Adjust Contrast", onClick: () => setActiveComponent("contrast") },
    {
      label: "Adjust Saturation",
      onClick: () => setActiveComponent("saturation"),
    },
    { label: "Sharpen", onClick: () => setActiveComponent("sharpen") },
    { label: "Blur", onClick: () => setActiveComponent("blur") },
    { label: "Grayscale", onClick: () => setActiveComponent("grayscale") },
    { label: "Sepia", onClick: () => setActiveComponent("sepia") },
    { label: "Invert Colors", onClick: () => setActiveComponent("invert") },
    { label: "Add Text", onClick: () => setActiveComponent("text") },
    { label: "Add Sticker", onClick: () => setActiveComponent("sticker") },
    { label: "Add Frame", onClick: () => setActiveComponent("frame") },
  ];

  // Lọc các button theo từ khóa tìm kiếm
  const filteredFunctions = functions.filter((func) =>
    func.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hàm để render component tương ứng
  const renderComponent = () => {
    switch (activeComponent) {
      case "crop":
        return (
          <Crop
            image={selectedImage}
            // top={top}
            // left={left}
            // width={width}
            // height={height}
            onCrop={handleCrop}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onSave={handleSave}
          />
        );
      case "resize":
        return <Resize />;
      case "removebg":
        return <RemoveBackground />;
      case "rotate":
        return <div>Rotate Component</div>;
      case "flip":
        return <div>Flip Component</div>;
      case "brightness":
        return <div>Brightness Component</div>;
      case "contrast":
        return <div>Contrast Component</div>;
      case "saturation":
        return <div>Saturation Component</div>;
      case "sharpen":
        return <div>Sharpen Component</div>;
      case "blur":
        return <div>Blur Component</div>;
      case "grayscale":
        return <div>Grayscale Component</div>;
      case "sepia":
        return <div>Sepia Component</div>;
      case "invert":
        return <div>Invert Colors Component</div>;
      case "text":
        return <div>Add Text Component</div>;
      case "sticker":
        return <div>Add Sticker Component</div>;
      case "frame":
        return <div>Add Frame Component</div>;
      default:
        return null;
    }
  };

  return (
    <>
      <Head>
        <title>Chỉnh sửa hình ảnh | MultiTools</title>
        <meta
          name="description"
          content="Trang chỉnh sửa hình ảnh của MultiTools với các công cụ đa dạng và mạnh mẽ."
        />
      </Head>
      <div
        style={{ height: "100vh", display: "flex", flexDirection: "column" }}
      >
        <div
          style={{
            height: "80px",
            backgroundColor: "black",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 20px",
          }}
        >
          <button
            onClick={handleRemoveImage}
            style={{
              padding: "5px 10px",
              marginRight: "10px",
              borderRadius: "5px",
              backgroundColor: "red",
              color: "white",
            }}
          >
            Xóa ảnh
          </button>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{
              padding: "5px 10px",
              borderRadius: "5px",
              backgroundColor: "green",
              color: "white",
            }}
            id="fileInput"
          />

          <span style={{ color: "white", marginLeft: "10px" }}>
            {selectedImage && selectedImage.name ? selectedImage.name : ""}
          </span>
        </div>
        <div style={{ flexGrow: 1, display: "flex" }}>
          <div
            style={{
              width: "80%",
              backgroundColor: "#333",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Selected"
                style={{ maxWidth: "100%", height: "auto" }}
                id="myImage" // Thêm id cho hình ảnh
              />
            ) : (
              <div
                style={{
                  height: "100%",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Hãy thực hiện việc thêm ảnh
              </div>
            )}
          </div>
          {selectedImage && ( // Chỉ hiển thị menu chức năng khi có ảnh
            <div
              style={{
                backgroundColor: "#ccc",
                width: "20%",
                display: "flex",
                flexDirection: "column",
                padding: "20px",
                overflowY: "auto", // Cho phép cuộn khi nội dung vượt quá chiều cao
                maxHeight: "100vh", // Đảm bảo phần này không vượt quá chiều cao của màn hình
              }}
            >
              {/* Nếu có component được chọn, hiển thị nút "Quay lại" */}
              {activeComponent ? (
                <button
                  onClick={() => setActiveComponent(null)}
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    backgroundColor: "blue",
                    color: "white",
                    marginBottom: "10px",
                  }}
                >
                  Quay lại
                </button>
              ) : null}

              {/* Thanh tìm kiếm */}
              {!activeComponent && (
                <input
                  type="text"
                  placeholder="Tìm kiếm chức năng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    marginBottom: "10px",
                    width: "100%",
                  }}
                />
              )}

              {/* Hiển thị danh sách các chức năng */}
              {!activeComponent ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                  }}
                >
                  {filteredFunctions.map((func) => (
                    <ButtonSelection
                      key={func.label}
                      label={func.label}
                      onClick={func.onClick}
                      style={{ height: "80px" }}
                    />
                  ))}
                </div>
              ) : (
                // Nếu có component được chọn, hiển thị component đó
                renderComponent()
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
