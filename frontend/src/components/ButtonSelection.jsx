export default function ButtonSelection({ onClick, label }) {
    return (
        <button 
            onClick={onClick} 
            style={{
                flex: '1 1 45%',
                // margin: '5px', 
                width: '100px',
                height: '100px',
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',   
                backgroundColor: 'lightblue', 
                border: 'none',
                borderRadius: '5px', 
                fontSize: '16px',
                textAlign: 'center', 
                cursor: 'pointer',
            }}
        >
            {label}
        </button>
    );
}
