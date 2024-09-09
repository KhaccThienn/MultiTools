export default function ButtonSelection({ onClick, label }) {
    return (
        <button 
            onClick={onClick} 
            style={{
                flex: '1 1 45%', // Mỗi button sẽ chiếm 45% width, với 10% cho khoảng trống giữa các button
                // margin: '5px',   // Thêm khoảng cách giữa các button
                width: '100px',  // Độ rộng của button
                height: '100px', // Độ cao bằng với độ rộng để tạo hình vuông
                display: 'flex', // Đảm bảo nội dung bên trong button căn giữa
                justifyContent: 'center', // Căn giữa theo chiều ngang
                alignItems: 'center',     // Căn giữa theo chiều dọc
                backgroundColor: 'lightblue', // Màu nền cho button
                border: 'none',
                borderRadius: '5px', // Bo góc nhẹ để các button đẹp hơn
                fontSize: '16px', // Kích thước chữ
                textAlign: 'center', // Văn bản được căn giữa
                cursor: 'pointer', // Thay đổi con trỏ khi di chuột qua button
            }}
        >
            {label}
        </button>
    );
}
