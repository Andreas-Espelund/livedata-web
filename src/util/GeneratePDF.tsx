import jsPDF from 'jspdf';
import 'jspdf-autotable';

import autoTable from "jspdf-autotable";
import {statusMap} from "@/pages/individuals";
import {formatDate} from "@/util/utils";
import {Individual} from "@/types/types";
import {Selection} from "@nextui-org/react";


export const generatePdf = (individuals: Individual[], selectedCols: Selection, title: string) => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold")
    doc.setFontSize(20)
    doc.text(title, 15, 10);


    const today = formatDate(new Date())

    doc.setFontSize(10)
    doc.setFont("helvetica", "italic")
    doc.text(`Skrevet ut: ${today}`, 160, 10, {})

    const cols = Array.from(selectedCols).filter(col => col !== 'actions')

    // Mapping of column IDs to their labels
    const columnMapping = {
        id: "ID",
        birth_date: "FØDT",
        status: "STATUS",
        gender: "KJØNN",
        bottle: "KOPPLAM",
        mother: "MOR",
        father: "FAR",
    };

    // Filter the headers based on selected columns
    const tableHeaders = cols.map(colId => columnMapping[colId]);

    const tableRows = individuals.map(individual => {
        return cols.map(colId => {
            if (colId === 'bottle') {
                return individual.bottle ? 'Kopp' : ''; // Assuming bottle is a boolean
            }
            if (colId == 'father') {
                return individual.father || '-'
            }
            if (colId == 'mother') {
                return individual.mother || '-'
            }
            if (colId == 'gender') {
                return individual.gender === "female" ? "Søye" : "Veir"
            }
            if (colId == 'status') {
                return statusMap[individual[colId]]
            }
            if (colId == 'birth_date') {
                return individual[colId]
            }
            return individual[colId] || colId;
        });
    });

    autoTable(doc, {
        head: [tableHeaders],
        body: tableRows,
        styles: {
            font: 'helvetica', // Set the font
            fontSize: 11,      // Set font size
            cellPadding: 5,    // Set cell padding
            halign: 'left',    // Horizontal align: 'left', 'center', 'right'
            valign: 'middle',   // Vertical align: 'top', 'middle', 'bottom'
            overflow: 'linebreak'
        },
        headStyles: {
            fillColor: '#374A67', // Set the header background color
            textColor: 'white',              // Set the header text color
            fontStyle: 'bold'           // Set the header font style
        },
        footStyles: {
            fillColor: [200, 200, 200],
            textColor: 50,
            fontStyle: 'bold'
        },
        columnStyles: {
            0: {
                fontStyle: "bold",
                fontSize: 12
            }
        },
        theme: 'striped'
    });

    doc.setFontSize(10)

    // adding page numbers
    const total_pages = doc.getNumberOfPages()
    const pageSize = doc.internal.pageSize
    const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight()
    const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth()

    for (let i = 1; i <= total_pages; i++) {
        const str = `Side ${i} / ${total_pages}`
        const textWidth = doc.getStringUnitWidth(str) * doc.getFontSize() / doc.internal.scaleFactor
        doc.setPage(i)
        doc.text(str, pageWidth - textWidth - 10, pageHeight - 10)
    }


    // save directly
    //doc.save(title)


    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
};
