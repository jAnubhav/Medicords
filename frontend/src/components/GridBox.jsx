const GridBox = ({ color, svg, title, children }) => {
    return (
        <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 text-${"yellow"}-400 mr-2`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={svg} />
                </svg>
                <h4 className="text-sm font-medium text-white">{title}</h4>
            </div> {children}
        </div>
    );
};

const TextBox = ({ color, svg, title, value }) => {
    return (
        <GridBox color={color} svg={svg} title={title}>
            <div className={`bg-${color}-900/20 border border-${color}-800/30 text-${color}-100 px-3 py-2 rounded-lg`}>
                <p className="text-white text-sm font-medium">{value}</p>
            </div>
        </GridBox>
    );
}

export { GridBox, TextBox };