'use client';
const TableData = ({ data }) => {
    // Tạo một object để nhóm các đối tượng theo key
    const groupedData = data.reduce((acc, obj) => {
        Object.entries(obj).forEach(([key, value]) => {
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(value);
        });
        return acc;
    }, {});

    const rows = Object.entries(groupedData).map(([key, values]) => ({
        key,
        values,
    }));
    
    return (
        <>
            <div className="max-h-96 overflow-y-auto">
                <table className="table border rounded-md overflow-x-auto">
                    <thead className="sticky -top-1 left-0 glass bg-sky-500">
                        <tr>
                            <th></th>
                            <th>Date</th>
                            <th>Open</th>
                            <th>High</th>
                            <th>Low</th>
                            <th>Close</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 && (
                            <tr>
                                <td className="text-center" colSpan={6}>
                                    No data
                                </td>
                            </tr>
                        )}
                        {rows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                <td>{row.key}</td>
                                {row.values.map((value, colIndex) => (
                                    <td key={colIndex}>{value}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default TableData;
