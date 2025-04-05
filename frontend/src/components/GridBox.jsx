const colorStyles = {
    red: {
        text: "text-red-100", bg: "bg-red-900/20",
        border: "border-red-800/30", icon: "text-red-400"
    },
    yellow: {
        text: "text-yellow-100", bg: "bg-yellow-900/20",
        border: "border-yellow-800/30", icon: "text-yellow-400"
    },
    green: {
        text: "text-green-100", bg: "bg-green-900/20",
        border: "border-green-800/30", icon: "text-green-400"
    }
};

const GridBox = ({ color, svg, title, children }) => {
    const icon = colorStyles[color].icon;
    
    return (
        <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 ${icon} mr-2`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={svg} />
                </svg>
                
                <h4 className="text-sm font-medium text-white">{title}</h4>
            </div> {children}
        </div>
    );
};

const TextBox = ({ color, svg, title, value }) => {
    const styles = colorStyles[color];
    
    return (
        <GridBox color={color} svg={svg} title={title}>
            <div className={`${styles.bg} ${styles.border} ${styles.text} px-3 py-2 rounded-lg`}>
                <p className="text-white text-sm font-medium">{value}</p>
            </div>
        </GridBox>
    );
}

export { GridBox, TextBox };