import PDFDocument from "pdfkit";
import path from "path";
import { Response } from "express";


export const generateSalarySlip = async (
    salary: any,
    res: Response
) => {

    const employee = salary.user;


    const doc = new PDFDocument({
        size: "A4",
        margin: 35,
    });


    res.setHeader(
        "Content-Type",
        "application/pdf"
    );


    res.setHeader(
        "Content-Disposition",
        `attachment; filename=SalarySlip-${salary.month}-${salary.year}.pdf`
    );


    doc.pipe(res);



    const logo = path.join(
        __dirname,
        "../../assets/logo.png"
    );



    // ================================
    // HEADER
    // ================================


    // doc.image(
    //     logo,
    //     270,
    //     25,
    //     {
    //         width: 50
    //     }
    // );


    doc.y = 80;


    doc
    .fontSize(15)
    .font("Helvetica-Bold")
    .text(
        "SOURCERY IT",
        {
            align:"center"
        }
    );


    doc
    .fontSize(9)
    .font("Helvetica")
    .text(
        "www.sourceryit.com",
        {
            align:"center"
        }
    );


    doc
    .fontSize(11)
    .font("Helvetica-Bold")
    .text(
        `Salary Slip - ${getMonthName(salary.month)} ${salary.year}`,
        {
            align:"center"
        }
    );


    line(doc);



    // ================================
    // EMPLOYEE INFORMATION
    // ================================


    heading(
        doc,
        "Employee Information"
    );


    row(
        doc,
        "Employee Name",
        employee.name
    );


    row(
        doc,
        "Employee ID",
        `EMP${String(employee.id).padStart(3,"0")}`
    );


    row(
        doc,
        "Designation",
        employee.designation || "-"
    );


    row(
        doc,
        "Department",
        employee.department || "Development"
    );


    row(
        doc,
        "Payment Status",
        salary.status.toUpperCase()
    );


    line(doc);



    // ================================
    // EARNINGS
    // ================================


    heading(
        doc,
        "EARNINGS"
    );


    amount(
        doc,
        "Base Salary",
        salary.baseSalary
    );


    total(
        doc,
        "Total Earnings",
        salary.baseSalary
    );


    line(doc);



    // ================================
    // DEDUCTIONS
    // ================================


    heading(
        doc,
        "DEDUCTIONS"
    );


    const perDaySalary =
        Number(salary.baseSalary) / 22;


    if(Number(salary.lopDays) > 0){

        amount(
            doc,
            `LOP (${salary.lopDays} Day)`,
            salary.lopDays * perDaySalary
        );

    }


    if(Number(salary.wfhDeductionDays) > 0){

        amount(
            doc,
            `WFH (${salary.wfhDeductionDays} Day)`,
            salary.wfhDeductionDays * perDaySalary
        );

    }


    total(
        doc,
        "Total Deduction",
        salary.deductionAmount
    );


    line(doc);



    // ================================
    // NET SALARY
    // ================================


    doc
    .fontSize(13)
    .font("Helvetica-Bold")
    .text(
        `NET SALARY : ₹${money(salary.salary)}`,
        {
            align:"center"
        }
    );


    line(doc);



    // ================================
    // PAYMENT DETAILS
    // ================================


    heading(
        doc,
        "Payment Details"
    );


    row(
        doc,
        "Paid Date",
        salary.paidDate
        ?
        new Date(salary.paidDate)
        .toLocaleDateString(
            "en-IN",
            {
                day:"2-digit",
                month:"short",
                year:"numeric"
            }
        )
        :
        "-"
    );


    row(
        doc,
        "Generated On",
        new Date()
        .toLocaleDateString(
            "en-IN",
            {
                day:"2-digit",
                month:"short",
                year:"numeric"
            }
        )
    );



    if(salary.remarks){

        doc
        .fontSize(9)
        .font("Helvetica-Bold")
        .text(
            "Remarks"
        );


        doc
        .font("Helvetica")
        .text(
            salary.remarks
        );

    }



    line(doc);



    // ================================
    // SIGN
    // ================================


    doc
    .fontSize(9)
    .text(
        "Authorized Signatory",
        400
    );


    doc
    .text(
        "______________",
        400
    );



    doc.moveDown(1);



    // ================================
    // FOOTER
    // ================================


    doc
    .fontSize(8)
    .font("Helvetica-Oblique")
    .text(
        "SOURCERY IT SOLUTIONS",
        {
            align:"center"
        }
    );


    doc
    .fontSize(8)
    .text(
        "This is a computer-generated salary slip.",
        {
            align:"center"
        }
    );


    doc.end();

};





// ================================
// HELPERS
// ================================


function line(doc:PDFKit.PDFDocument){

    doc
    .moveTo(35,doc.y)
    .lineTo(560,doc.y)
    .stroke();

    doc.moveDown(0.3);

}



function heading(
    doc:PDFKit.PDFDocument,
    text:string
){

    doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text(text);

    doc.moveDown(0.2);

}



function row(
    doc:PDFKit.PDFDocument,
    label:string,
    value:string
){

    const y = doc.y;


    doc
    .fontSize(9)
    .font("Helvetica")
    .text(
        label,
        45,
        y
    );


    doc.text(
        ": " + value,
        180,
        y
    );


    doc.moveDown(0.25);

}



function amount(
    doc:PDFKit.PDFDocument,
    label:string,
    value:number
){

    const y = doc.y;


    doc
    .fontSize(9)
    .text(
        label,
        45,
        y
    );


    doc.text(
        `₹${money(value)}`,
        450,
        y
    );


    doc.moveDown(0.25);

}



function total(
    doc:PDFKit.PDFDocument,
    label:string,
    value:number
){

    doc
    .fontSize(9)
    .font("Helvetica-Bold")
    .text(
        label,
        300
    );


    doc.text(
        `₹${money(value)}`,
        450,
        doc.y-11
    );


    doc.moveDown(0.25);

}



function money(amount:number){

    return Number(amount)
    .toLocaleString(
        "en-IN",
        {
            minimumFractionDigits:2,
            maximumFractionDigits:2
        }
    );

}



function getMonthName(month:number){

    return [
        "",
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ][month];

}