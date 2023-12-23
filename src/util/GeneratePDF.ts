import jsPDF from "jspdf";

export default function exportTableToPDF(rows, columns){
    const doc = new jsPDF();

    // Set title for the PDF
    doc.setFontSize(16);
    doc.text('Besetning', 15, 15);

    // Create an empty array to hold table data
    const tableData = [];

    // Add table headers as the first row
    const headerRow = columns.map(col => col.label);
    tableData.push(headerRow);

    // Add rows to the data array
    rows.forEach(row => {
        const rowData = [
            row.id.toString(),
            row.birth_date,
            row.active ? 'Ja' : 'Nei',
            row.gender ? 'Søye' : 'Veir',
            row.mother?.toString() || '',
            row.father?.toString() || '',
            row.bottle ? 'Ja' : 'Nei',
        ];
        tableData.push(rowData);
    });

    // Generate the table using autoTable function
    doc.autoTable({
        head: [headerRow], // Pass the header row
        body: tableData.slice(1), // Pass rows excluding header
        startY: 25,
    });

    // Save the PDF
    doc.save('export.pdf');
};